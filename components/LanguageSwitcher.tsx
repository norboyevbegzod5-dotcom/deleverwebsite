"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <div
      aria-label={t("switchLanguage")}
      className="flex items-center gap-1 rounded-lg border border-white/10 bg-surface p-1 text-[11px] font-semibold"
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`rounded-md px-2 py-1 uppercase transition ${
            l === locale ? "bg-primary text-navy" : "text-slate-400 hover:text-white"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
