"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import { leadSchema, moduleValues } from "@/lib/validation";
import { modules, orderRangeOptions } from "@/lib/constants";

const clientSchema = leadSchema.omit({ locale: true });
type FormValues = z.input<typeof clientSchema>;

type Props = {
  idPrefix: string;
  variant?: "light" | "dark";
};

export default function LeadForm({ idPrefix, variant = "light" }: Props) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      telegram: "",
      restaurantName: "",
      modules: [],
      website: "",
    },
  });

  const moduleTitleKey: Record<(typeof moduleValues)[number], string> = {
    sales_channels: "moduleSalesChannels",
    operations: "moduleOperations",
    courier_management: "moduleCourierManagement",
    crm: "moduleCrm",
    analytics: "moduleAnalytics",
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
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const isDark = variant === "dark";
  const labelClass = isDark ? "text-slate-200" : "text-slate-700";
  const inputClass = `w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/50 ${
    isDark
      ? "border-white/15 bg-white/5 text-white placeholder:text-slate-400 focus:border-primary"
      : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary"
  }`;
  const errorClass = "mt-1 text-xs text-red-400";

  if (status === "success") {
    return (
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl p-8 text-center ${
          isDark ? "bg-white/5" : "bg-emerald-50"
        }`}
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
          {t("successTitle")}
        </h3>
        <p className={isDark ? "text-slate-300" : "text-slate-600"}>{t("successMessage")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {/* Honeypot field — hidden from real users, catches simple bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-name`} className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
            {t("nameLabel")}
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            placeholder={t("namePlaceholder")}
            className={inputClass}
            {...register("name")}
          />
          {errors.name && <p className={errorClass}>{t("requiredError")}</p>}
        </div>

        <div>
          <label htmlFor={`${idPrefix}-phone`} className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
            {t("phoneLabel")}
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            placeholder={t("phonePlaceholder")}
            className={inputClass}
            {...register("phone")}
          />
          {errors.phone && <p className={errorClass}>{t("invalidPhoneError")}</p>}
        </div>

        <div>
          <label htmlFor={`${idPrefix}-telegram`} className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
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
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-restaurantName`}
            className={`mb-1.5 block text-sm font-medium ${labelClass}`}
          >
            {t("restaurantLabel")}
          </label>
          <input
            id={`${idPrefix}-restaurantName`}
            type="text"
            placeholder={t("restaurantPlaceholder")}
            className={inputClass}
            {...register("restaurantName")}
          />
          {errors.restaurantName && <p className={errorClass}>{t("requiredError")}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-ordersPerDay`} className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
          {t("ordersLabel")}
        </label>
        <select
          id={`${idPrefix}-ordersPerDay`}
          defaultValue=""
          className={inputClass}
          {...register("ordersPerDay")}
        >
          <option value="" disabled>
            {t("ordersPlaceholder")}
          </option>
          {orderRangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
        {errors.ordersPerDay && <p className={errorClass}>{t("selectOrdersError")}</p>}
      </div>

      <div>
        <span className={`mb-1.5 block text-sm font-medium ${labelClass}`}>{t("modulesLabel")}</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {modules.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                isDark
                  ? "border-white/15 bg-white/5 text-slate-200 hover:border-primary"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary"
              }`}
            >
              <input
                type="checkbox"
                value={m.id}
                className="h-4 w-4 shrink-0 accent-primary"
                {...register("modules")}
              />
              {t(moduleTitleKey[m.id])}
            </label>
          ))}
        </div>
        {errors.modules && <p className={errorClass}>{t("selectModuleError")}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? t("submitting") : t("submitButton")}
      </button>

      {status === "error" && <p className="text-sm text-red-400">{t("errorMessage")}</p>}

      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t("privacyNote")}</p>
    </form>
  );
}
