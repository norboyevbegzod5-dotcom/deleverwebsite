"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <div
      aria-label={t("switchLanguage")}
      className={`flex items-center gap-1 rounded-full border p-1 text-xs font-semibold ${
        dark ? "border-white/20" : "border-slate-200"
      }`}
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`rounded-full px-2.5 py-1 uppercase transition ${
            l === locale
              ? "bg-primary text-white"
              : dark
                ? "text-slate-300 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
