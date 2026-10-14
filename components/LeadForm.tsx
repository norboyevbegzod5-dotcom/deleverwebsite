"use client";

import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import {
  isQualified,
  leadObjectSchema,
  requireLocation,
  requireOtherText,
} from "@/lib/validation";
import {
  aggregatorOptions,
  branchOptions,
  orderRangeOptions,
  posOptions,
  problemOptions,
} from "@/lib/constants";
import { useRouter } from "@/i18n/navigation";
import { trackLead } from "@/lib/metaPixel";

const clientSchema = leadObjectSchema
  .omit({ locale: true })
  .refine(requireOtherText, {
    message: "otherText required when 'other' is selected",
    path: ["otherText"],
  })
  .refine(requireLocation, {
    message: "location required",
    path: ["location"],
  });
type FormValues = z.input<typeof clientSchema>;

type Option = { value: string; label?: string; labelKey?: string };

type StepDef =
  | {
      kind: "text";
      field: "location" | "deliverySystem" | "restaurantName" | "name";
      titleKey: string;
      placeholderKey: string;
    }
  | {
      kind: "single";
      field: "branches" | "pos" | "ordersPerDay";
      titleKey: string;
      options: readonly Option[];
    }
  | {
      kind: "multi";
      field: "aggregators" | "modules";
      titleKey: string;
      options: readonly Option[];
      exclusive?: string;
    }
  | { kind: "contact"; titleKey: string };

const STEPS: StepDef[] = [
  {
    kind: "text",
    field: "location",
    titleKey: "stepLocation",
    placeholderKey: "locationPlaceholder",
  },
  {
    kind: "single",
    field: "branches",
    titleKey: "stepBranches",
    options: branchOptions,
  },
  { kind: "single", field: "pos", titleKey: "stepPos", options: posOptions },
  {
    kind: "single",
    field: "ordersPerDay",
    titleKey: "stepOrders",
    options: orderRangeOptions,
  },
  {
    kind: "multi",
    field: "aggregators",
    titleKey: "stepAggregators",
    options: aggregatorOptions,
    exclusive: "none",
  },
  {
    kind: "text",
    field: "deliverySystem",
    titleKey: "stepDelivery",
    placeholderKey: "deliveryPlaceholder",
  },
  {
    kind: "multi",
    field: "modules",
    titleKey: "stepModules",
    options: problemOptions,
  },
  {
    kind: "text",
    field: "restaurantName",
    titleKey: "stepRestaurant",
    placeholderKey: "restaurantPlaceholder",
  },
  {
    kind: "text",
    field: "name",
    titleKey: "stepName",
    placeholderKey: "namePlaceholder",
  },
  { kind: "contact", titleKey: "stepPhone" },
];

const PHONE_PREFIX: Record<string, string> = {
  uz: "+998",
  ru: "+998",
  kk: "+7",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 sm:text-sm focus:border-primary focus:ring-2 focus:ring-primary/30";
const errorClass = "mt-2 text-xs text-red-400";

// Mobile keyboards cover the lower half of the screen; wait for it to open, then
// scroll the focused field into the visible area.
const keepAboveKeyboard = (e: React.FocusEvent<HTMLFormElement>) => {
  const el = e.target;
  if (!(el instanceof HTMLInputElement)) return;
  setTimeout(
    () => el.scrollIntoView({ block: "center", behavior: "smooth" }),
    300,
  );
};

function OptionButton({
  selected,
  multi,
  onClick,
  children,
}: {
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
        selected
          ? "border-primary bg-primary/10 text-white"
          : "border-white/10 bg-background/60 text-slate-300 hover:border-primary/50 hover:text-white"
      }`}
    >
      {multi && (
        <span
          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${
            selected ? "border-primary bg-primary text-navy" : "border-white/25"
          }`}
        >
          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
      )}
      {children}
    </button>
  );
}

export default function LeadForm({ idPrefix }: { idPrefix: string }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [phoneLocal, setPhoneLocal] = useState("");
  const [notFit, setNotFit] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const phonePrefix = PHONE_PREFIX[locale] ?? "+998";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      location: "",
      planning: false,
      aggregators: [],
      deliverySystem: "",
      modules: [],
      otherText: "",
      restaurantName: "",
      name: "",
      phone: "",
      telegram: "",
      website: "",
    },
  });

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const values = watch();
  const optionLabel = (o: Option) => (o.labelKey ? t(o.labelKey) : o.label);

  const advance = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

  const goNext = async () => {
    if (step.kind === "contact") return;
    if (step.field === "location") {
      // Checked by hand for the same reason as "modules": the planning/location rule is object-level.
      if ((getValues("location") ?? "").trim().length < 2)
        return setError("location", { type: "min" });
      clearErrors("location");
      setValue("planning", false);
      return advance();
    }
    if (step.field === "modules") {
      // Checked by hand: the schema-level "other" refinement only runs once every field is filled.
      clearErrors(["modules", "otherText"]);
      const modules = getValues("modules") ?? [];
      if (modules.length === 0) return setError("modules", { type: "min" });
      if (modules.includes("other") && !getValues("otherText")?.trim()) {
        return setError("otherText", { type: "required" });
      }
      return advance();
    }
    if (await trigger(step.field)) advance();
  };

  const chooseSingle = (
    field: "branches" | "pos" | "ordersPerDay",
    value: string,
  ) => {
    setValue(field, value as never, { shouldValidate: true });
    const answers = {
      pos: getValues("pos") ?? "",
      ordersPerDay: getValues("ordersPerDay") ?? "",
    };
    if (!isQualified(answers)) return setNotFit(true);
    advance();
  };

  const choosePlanning = () => {
    setValue("location", "");
    setValue("planning", true);
    clearErrors("location");
    advance();
  };

  const toggleMulti = (
    field: "aggregators" | "modules",
    value: string,
    exclusive?: string,
  ) => {
    const current: string[] = getValues(field) ?? [];
    let next: string[];
    if (current.includes(value)) next = current.filter((v) => v !== value);
    else if (value === exclusive) next = [value];
    else next = [...current.filter((v) => v !== exclusive), value];
    setValue(field, next as never);
    if (next.length > 0) clearErrors(field);
  };

  const onPhoneChange = (raw: string) => {
    const local = raw.replace(/[^\d\s]/g, "");
    setPhoneLocal(local);
    setValue("phone", `${phonePrefix} ${local.replace(/\s+/g, " ").trim()}`, {
      shouldValidate: Boolean(errors.phone),
    });
  };

  const onSubmit = async (data: FormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error("request_failed");
      trackLead();
      reset();
      router.push("/thank-you");
    } catch {
      setStatus("error");
    }
  };

  // Enter in a text field advances to the next step; only the last step submits.
  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!isLast) {
      e.preventDefault();
      void goNext();
      return;
    }
    void handleSubmit(onSubmit)(e);
  };

  const nextButton = (
    <button
      type="submit"
      className="btn-primary mt-4 w-full px-6 py-3.5 text-sm"
    >
      {t("next")}
    </button>
  );

  return (
    <form
      onSubmit={onFormSubmit}
      onFocus={keepAboveKeyboard}
      noValidate
      className="rounded-3xl border border-white/10 bg-background/40 p-4 sm:p-6"
    >
      {/* Honeypot field — hidden from real users, catches simple bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />

      <div className="flex h-9 items-center justify-between">
        {stepIndex > 0 || notFit ? (
          <button
            type="button"
            onClick={() =>
              notFit ? setNotFit(false) : setStepIndex((i) => i - 1)
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("back")}
          </button>
        ) : (
          <span />
        )}
        <span className="text-xs tabular-nums text-slate-500">
          {stepIndex + 1}/{STEPS.length}
        </span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-brand-gradient transition-[width] duration-300"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {notFit ? (
        <div className="animate-step-in mt-6 pb-2">
          <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
            {t("notFitTitle")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {t("notFitText")}
          </p>
        </div>
      ) : (
        <div key={stepIndex} className="animate-step-in mt-6">
          <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
            {t(step.titleKey)}
          </h3>

          {step.kind === "text" && (
            <div className="mt-4">
              <input
                id={`${idPrefix}-${step.field}`}
                type="text"
                autoFocus
                autoComplete={step.field === "name" ? "name" : "off"}
                aria-label={t(step.titleKey)}
                placeholder={t(step.placeholderKey)}
                className={inputClass}
                {...register(step.field)}
              />
              {errors[step.field] && (
                <p className={errorClass}>{t("requiredError")}</p>
              )}
              {nextButton}
              {step.field === "location" && (
                <div className="mt-3">
                  <OptionButton
                    selected={Boolean(values.planning)}
                    onClick={choosePlanning}
                  >
                    {t("planningOption")}
                  </OptionButton>
                </div>
              )}
            </div>
          )}

          {step.kind === "single" && (
            <div className="mt-4 flex flex-col gap-2.5">
              {step.options.map((o) => (
                <OptionButton
                  key={o.value}
                  selected={values[step.field] === o.value}
                  onClick={() => chooseSingle(step.field, o.value)}
                >
                  {optionLabel(o)}
                </OptionButton>
              ))}
              {errors[step.field] && (
                <p className={errorClass}>{t("selectOptionError")}</p>
              )}
            </div>
          )}

          {step.kind === "multi" && (
            <div className="mt-4">
              <p className="-mt-2 mb-3 text-xs text-slate-500">
                {t("stepModulesHint")}
              </p>
              <div className="flex flex-col gap-2.5">
                {step.options.map((o) => (
                  <OptionButton
                    key={o.value}
                    multi
                    selected={((values[step.field] ?? []) as string[]).includes(
                      o.value,
                    )}
                    onClick={() =>
                      toggleMulti(step.field, o.value, step.exclusive)
                    }
                  >
                    {optionLabel(o)}
                  </OptionButton>
                ))}
              </div>
              {errors[step.field] && (
                <p className={errorClass}>{t("selectModuleError")}</p>
              )}
              {step.field === "modules" &&
                values.modules?.includes("other") && (
                  <div className="mt-3">
                    <input
                      type="text"
                      autoFocus
                      placeholder={t("otherPlaceholder")}
                      className={inputClass}
                      {...register("otherText")}
                    />
                    {errors.otherText && (
                      <p className={errorClass}>{t("otherRequiredError")}</p>
                    )}
                  </div>
                )}
              {nextButton}
            </div>
          )}

          {step.kind === "contact" && (
            <div className="mt-4">
              <div className="flex items-center rounded-xl border border-white/10 bg-background/60 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <span className="pl-4 text-base text-slate-400 sm:text-sm">
                  {phonePrefix}
                </span>
                <input
                  id={`${idPrefix}-phone`}
                  type="tel"
                  inputMode="tel"
                  autoFocus
                  autoComplete="tel-national"
                  aria-label={t("phoneLabel")}
                  placeholder={
                    locale === "kk" ? "701 123 45 67" : "90 123 45 67"
                  }
                  maxLength={14}
                  value={phoneLocal}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="w-full bg-transparent px-2 py-3 text-base text-white outline-none placeholder:text-slate-500 sm:text-sm"
                />
              </div>
              {errors.phone && (
                <p className={errorClass}>{t("invalidPhoneError")}</p>
              )}

              <label
                htmlFor={`${idPrefix}-telegram`}
                className="mt-4 mb-1.5 block text-xs font-medium text-slate-400"
              >
                {t("telegramLabel")}
              </label>
              <input
                id={`${idPrefix}-telegram`}
                type="text"
                placeholder={t("telegramPlaceholder")}
                className={inputClass}
                {...register("telegram")}
              />
              {errors.telegram && (
                <p className={errorClass}>{t("invalidTelegramError")}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary mt-5 w-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {status === "submitting" ? t("submitting") : t("submitButton")}
              </button>

              {status === "error" && (
                <p className="mt-3 text-sm text-red-400">{t("errorMessage")}</p>
              )}
              <p className="mt-3 text-xs text-slate-500">{t("privacyNote")}</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
