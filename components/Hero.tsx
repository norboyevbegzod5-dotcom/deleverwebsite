"use client";

import { useTranslations } from "next-intl";
import { openLeadModal } from "./LeadModal";
import TrustStrip from "./TrustStrip";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">{t("badge")}</p>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={openLeadModal} className="btn-primary px-7 py-4 text-base">
              {t("primaryCta")}
            </button>
            <a href="#features" className="btn-secondary px-7 py-4 text-base">
              {t("secondaryCta")}
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">{t("note")}</p>
        </div>

        <TrustStrip />

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-surface p-2 shadow-2xl">
          <video
            className="aspect-video h-full w-full rounded-2xl object-cover"
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
