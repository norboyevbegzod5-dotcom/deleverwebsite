import { useTranslations } from "next-intl";
import {
  ShoppingCart,
  Settings2,
  Truck,
  Users,
  BarChart3,
  Plug,
  ShieldCheck,
  Headset,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { modules, highlights, stats } from "@/lib/constants";

const MODULE_ICONS: Record<(typeof modules)[number]["id"], LucideIcon> = {
  sales_channels: ShoppingCart,
  operations: Settings2,
  courier_management: Truck,
  crm: Users,
  analytics: BarChart3,
};

const HIGHLIGHT_ICONS: Record<(typeof highlights)[number], LucideIcon> = {
  highlightsIntegrations: Plug,
  highlightsUptime: ShieldCheck,
  highlightsSupport: Headset,
  highlightsLaunch: Rocket,
};

export default function FeaturesSection() {
  const t = useTranslations("features");
  const ts = useTranslations("stats");

  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {t("heading")}
            </h2>
            <p className="mt-5 max-w-xl text-slate-400">{t("subheading")}</p>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5">
            {stats.map((s) => (
              <div key={s.valueKey} className="bg-background p-5">
                <dt className="sr-only">{ts(s.labelKey)}</dt>
                <dd className="text-gradient text-3xl font-bold sm:text-4xl">{ts(s.valueKey)}</dd>
                <dd className="mt-1 text-sm text-slate-400">{ts(s.labelKey)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {modules.map((m, i) => {
            const Icon = MODULE_ICONS[m.id];
            const wide = i === modules.length - 1;
            return (
              <div
                key={m.id}
                className={`group flex flex-col justify-between gap-10 rounded-3xl border border-white/5 bg-surface p-7 transition hover:border-primary/30 sm:p-9 ${
                  wide ? "md:col-span-2 md:flex-row md:items-center" : ""
                }`}
              >
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold tracking-tight text-white">{t(m.titleKey)}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{t(m.descKey)}</p>
                </div>
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-brand-gradient group-hover:text-navy">
                  <Icon className="h-7 w-7" />
                </span>
              </div>
            );
          })}
        </div>

        <ul className="mt-5 grid gap-4 rounded-3xl border border-white/5 bg-surface p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {highlights.map((key) => {
            const Icon = HIGHLIGHT_ICONS[key];
            return (
              <li key={key} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-slate-300">{t(key)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
