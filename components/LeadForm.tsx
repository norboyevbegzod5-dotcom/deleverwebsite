"use client";

import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { leadObjectSchema, requireOtherText, moduleValues } from "@/lib/validation";
import { orderRangeOptions } from "@/lib/constants";
import { useRouter } from "@/i18n/navigation";
import { trackLead } from "@/lib/metaPixel";

const clientSchema = leadObjectSchema.omit({ locale: true }).refine(requireOtherText, {
  message: "otherText required when 'other' is selected",
  path: ["otherText"],
});
type FormValues = z.input<typeof clientSchema>;

const STEPS = ["orders", "modules", "restaurant", "name", "contact"] as const;
type Step = (typeof STEPS)[number];

const STEP_TITLE_KEY: Record<Step, string> = {
  orders: "stepOrders",
  modules: "stepModules",
  restaurant: "stepRestaurant",
  name: "stepName",
  contact: "stepPhone",
};

const MODULE_TITLE_KEY: Record<(typeof moduleValues)[number], string> = {
  sales_channels: "moduleSalesChannels",
  operations: "moduleOperations",
  courier_management: "moduleCourierManagement",
  crm: "moduleCrm",
  analytics: "moduleAnalytics",
  other: "moduleOther",
};

const PHONE_PREFIX: Record<string, string> = { uz: "+998", ru: "+998", kk: "+7" };

const inputClass =
  "w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30";
const errorClass = "mt-2 text-xs text-red-400";

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
      name: "",
      phone: "",
      telegram: "",
      restaurantName: "",
      modules: [],
      otherText: "",
      website: "",
    },
  });

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const ordersPerDay = watch("ordersPerDay");
  const selectedModules = watch("modules") ?? [];
  const otherText = watch("otherText") ?? "";
  const isOtherSelected = selectedModules.includes("other");

  const goNext = async () => {
    let valid = true;
    if (step === "orders") valid = await trigger("ordersPerDay");
    if (step === "modules") {
      // Checked by hand: the schema-level "other" refinement only runs once every field is filled.
      clearErrors(["modules", "otherText"]);
      if (selectedModules.length === 0) {
        setError("modules", { type: "min" });
        valid = false;
      } else if (isOtherSelected && !otherText.trim()) {
        setError("otherText", { type: "required" });
        valid = false;
      }
    }
    if (step === "restaurant") valid = await trigger("restaurantName");
    if (step === "name") valid = await trigger("name");
    if (valid) setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const chooseOrders = (value: (typeof orderRangeOptions)[number]["value"]) => {
    setValue("ordersPerDay", value, { shouldValidate: true });
    setStepIndex((i) => i + 1);
  };

  const toggleModule = (id: (typeof moduleValues)[number]) => {
    const current = getValues("modules") ?? [];
    const next = current.includes(id) ? current.filter((m) => m !== id) : [...current, id];
    setValue("modules", next);
    if (next.length > 0) clearErrors("modules");
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
    <button type="submit" className="btn-primary mt-4 w-full px-6 py-3.5 text-sm">
      {t("next")}
    </button>
  );

  return (
    <form onSubmit={onFormSubmit} noValidate className="rounded-3xl border border-white/10 bg-background/40 p-5 sm:p-6">
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
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i - 1)}
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

      <div key={step} className="animate-step-in mt-6">
        <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">{t(STEP_TITLE_KEY[step])}</h3>

        {step === "orders" && (
          <div className="mt-4 flex flex-col gap-2.5">
            {orderRangeOptions.map((opt) => (
              <OptionButton
                key={opt.value}
                selected={ordersPerDay === opt.value}
                onClick={() => chooseOrders(opt.value)}
              >
                {t(opt.labelKey)}
              </OptionButton>
            ))}
            {errors.ordersPerDay && <p className={errorClass}>{t("selectOrdersError")}</p>}
          </div>
        )}

        {step === "modules" && (
          <div className="mt-4">
            <p className="-mt-2 mb-3 text-xs text-slate-500">{t("stepModulesHint")}</p>
            <div className="flex flex-col gap-2.5">
              {moduleValues.map((id) => (
                <OptionButton key={id} multi selected={selectedModules.includes(id)} onClick={() => toggleModule(id)}>
                  {t(MODULE_TITLE_KEY[id])}
                </OptionButton>
              ))}
            </div>
            {errors.modules && <p className={errorClass}>{t("selectModuleError")}</p>}
            {isOtherSelected && (
              <div className="mt-3">
                <input
                  type="text"
                  autoFocus
                  placeholder={t("otherPlaceholder")}
                  className={inputClass}
                  {...register("otherText")}
                />
                {errors.otherText && <p className={errorClass}>{t("otherRequiredError")}</p>}
              </div>
            )}
            {nextButton}
          </div>
        )}

        {step === "restaurant" && (
          <div className="mt-4">
            <input
              id={`${idPrefix}-restaurantName`}
              type="text"
              autoFocus
              aria-label={t("restaurantLabel")}
              placeholder={t("restaurantPlaceholder")}
              className={inputClass}
              {...register("restaurantName")}
            />
            {errors.restaurantName && <p className={errorClass}>{t("requiredError")}</p>}
            {nextButton}
          </div>
        )}

        {step === "name" && (
          <div className="mt-4">
            <input
              id={`${idPrefix}-name`}
              type="text"
              autoFocus
              autoComplete="name"
              aria-label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              className={inputClass}
              {...register("name")}
            />
            {errors.name && <p className={errorClass}>{t("requiredError")}</p>}
            {nextButton}
          </div>
        )}

        {step === "contact" && (
          <div className="mt-4">
            <div className="flex items-center rounded-xl border border-white/10 bg-background/60 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
              <span className="pl-4 text-sm text-slate-400">{phonePrefix}</span>
              <input
                id={`${idPrefix}-phone`}
                type="tel"
                inputMode="tel"
                autoFocus
                autoComplete="tel-national"
                aria-label={t("phoneLabel")}
                placeholder={locale === "kk" ? "701 123 45 67" : "90 123 45 67"}
                maxLength={14}
                value={phoneLocal}
                onChange={(e) => onPhoneChange(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
            {errors.phone && <p className={errorClass}>{t("invalidPhoneError")}</p>}

            <label htmlFor={`${idPrefix}-telegram`} className="mt-4 mb-1.5 block text-xs font-medium text-slate-400">
              {t("telegramLabel")}
            </label>
            <input
              id={`${idPrefix}-telegram`}
              type="text"
              placeholder={t("telegramPlaceholder")}
              className={inputClass}
              {...register("telegram")}
            />
            {errors.telegram && <p className={errorClass}>{t("invalidTelegramError")}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-5 w-full px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "submitting" ? t("submitting") : t("submitButton")}
            </button>

            {status === "error" && <p className="mt-3 text-sm text-red-400">{t("errorMessage")}</p>}
            <p className="mt-3 text-xs text-slate-500">{t("privacyNote")}</p>
          </div>
        )}
      </div>
    </form>
  );
}
