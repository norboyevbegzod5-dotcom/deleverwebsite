import { useTranslations } from "next-intl";
import { stats } from "@/lib/constants";

export default function StatsSection() {
  const t = useTranslations("stats");

  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("heading")}</h2>
          <p className="mt-3 text-slate-600">{t("subheading")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.valueKey} className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">{t(s.valueKey)}</div>
              <div className="mt-2 text-sm text-slate-600">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
