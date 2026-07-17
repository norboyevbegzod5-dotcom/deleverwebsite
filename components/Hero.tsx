"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, X } from "lucide-react";
import LeadForm from "./LeadForm";

export default function Hero() {
  const t = useTranslations("hero");
  const tForm = useTranslations("form");
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

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

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {tForm("submitButton")}
          </button>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="pr-8 text-xl font-bold text-slate-900">{tForm("heading")}</h2>
            <p className="mt-1.5 mb-6 text-sm text-slate-600">{tForm("subheading")}</p>
            <LeadForm idPrefix="hero-modal" variant="light" />
          </div>
        </div>
      )}
    </section>
  );
}
