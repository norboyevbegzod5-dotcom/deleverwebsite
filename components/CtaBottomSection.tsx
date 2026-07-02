import { useTranslations } from "next-intl";
import LeadForm from "./LeadForm";

export default function CtaBottomSection() {
  const t = useTranslations("ctaBottom");
  const tForm = useTranslations("form");

  return (
    <section id="cta-bottom" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("heading")}</h2>
          <p className="mt-3 text-slate-600">{t("subheading")}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold text-slate-900">{tForm("heading")}</h3>
          <p className="mt-1.5 mb-6 text-sm text-slate-600">{tForm("subheading")}</p>
          <LeadForm idPrefix="bottom" variant="light" />
        </div>
      </div>
    </section>
  );
}
