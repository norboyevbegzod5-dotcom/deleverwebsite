import { useTranslations } from "next-intl";
import LeadForm from "./LeadForm";

export default function CtaBottomSection() {
  const t = useTranslations("ctaBottom");

  return (
    <section id="cta-bottom" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">{t("heading")}</h2>
          <LeadForm idPrefix="bottom" variant="light" />
        </div>
      </div>
    </section>
  );
}
