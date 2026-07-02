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
import { modules, highlights } from "@/lib/constants";

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

  return (
    <section id="features" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("heading")}</h2>
          <p className="mt-3 text-slate-600">{t("subheading")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = MODULE_ICONS[m.id];
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-slate-200 p-6 transition hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{t(m.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(m.descKey)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {highlights.map((key) => {
            const Icon = HIGHLIGHT_ICONS[key];
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <p className="text-sm font-medium text-slate-700">{t(key)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
