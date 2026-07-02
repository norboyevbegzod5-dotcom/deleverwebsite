import { useTranslations } from "next-intl";

const CLIENT_LOGOS = [
  { src: "/clients-evos.png", alt: "EVOS" },
  { src: "/clients-bellissimo-pizza.webp", alt: "Bellissimo Pizza" },
  { src: "/clients-loook.jfif", alt: "LOOOK" },
  { src: "/clients-dodo-pizza.jpg", alt: "Dodo Pizza" },
  { src: "/clients-resto.jfif", alt: "Resto Restaurant" },
  { src: "/clients-doner-satpayeva.avif", alt: "Doner na Satpayeva" },
  { src: "/clients-breadly.jfif", alt: "Breadly" },
];

export default function ClientsSection() {
  const t = useTranslations("clients");

  return (
    <section id="clients" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("heading")}</h2>
          <p className="mt-3 text-slate-600">{t("subheading")}</p>
        </div>

        <div
          className="mt-10 overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        >
          <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 sm:h-28 sm:w-48"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
