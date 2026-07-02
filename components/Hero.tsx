import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

export default function Hero() {
  const t = useTranslations("hero");

  const stats = [t("statBusinesses"), t("statCountries"), t("statOrders")];

  return (
    <section className="relative overflow-hidden bg-navy">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {t("badge")}
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white"
              >
                {s}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm text-slate-400">{t("note")}</p>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-2xl">
          <video
            className="h-full w-full object-cover"
            src="/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
