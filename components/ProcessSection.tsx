import { useTranslations } from "next-intl";

const STEPS = [1, 2, 3, 4] as const;

export default function ProcessSection() {
  const t = useTranslations("process");

  return (
    <section id="process" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {t("heading")}
          </h2>
          <p className="mt-5 max-w-md text-slate-400">{t("subheading")}</p>
        </div>

        <ol className="flex flex-col gap-10">
          {STEPS.map((n) => (
            <li key={n} className="flex gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-white">
                {n}
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">{t(`step${n}Title`)}</h3>
                <p className="mt-2 max-w-sm leading-relaxed text-slate-400">{t(`step${n}Desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
