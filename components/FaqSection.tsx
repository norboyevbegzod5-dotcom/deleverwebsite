import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

const QUESTIONS = [1, 2, 3, 4, 5] as const;

export default function FaqSection() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{t("heading")}</h2>
        </div>

        <div className="mt-12 divide-y divide-white/5 border-y border-white/5">
          {QUESTIONS.map((n) => (
            <details key={n} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                {t(`q${n}`)}
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 pr-8 leading-relaxed text-slate-400">{t(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
