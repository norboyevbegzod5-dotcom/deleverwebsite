import { useTranslations } from "next-intl";

const CLIENT_LOGOS_ROW_1 = [
  { src: "/clients-evos.png", alt: "EVOS" },
  { src: "/clients-bellissimo-pizza.webp", alt: "Bellissimo Pizza" },
  { src: "/clients-loook.jfif", alt: "LOOOK" },
  { src: "/clients-dodo-pizza.jpg", alt: "Dodo Pizza" },
  { src: "/clients-resto.jfif", alt: "Resto Restaurant" },
  { src: "/clients-doner-satpayeva.avif", alt: "Doner na Satpayeva" },
  { src: "/clients-breadly.jfif", alt: "Breadly" },
  { src: "/clients-manana.png", alt: "Manana" },
  { src: "/clients-gijduvon.webp", alt: "Gijduvon Premium" },
  { src: "/clients-plov-city.webp", alt: "Plov City" },
  { src: "/clients-pizza-hut.webp", alt: "Pizza Hut" },
];

const CLIENT_LOGOS_ROW_2 = [
  { src: "/clients-chitir-chitir.jpg", alt: "Chitir Chitir" },
  { src: "/clients-hardees.avif", alt: "Hardee's" },
  { src: "/clients-partner.png", alt: "Partner" },
  { src: "/clients-yaponamama.png", alt: "Yaponamama" },
  { src: "/clients-takumi.jpg", alt: "Takumi" },
  { src: "/clients-tarnov.png", alt: "Tarnov" },
  { src: "/clients-jonon-chicken.jfif", alt: "Jonon Chicken" },
  { src: "/clients-ser-gosht.jfif", alt: "Ser Gosht" },
  { src: "/clients-croissant-d-eco.jfif", alt: "Croissant by D Eco" },
  { src: "/clients-perfetto.jfif", alt: "Perfetto Halal Fast Food" },
];

function MarqueeRow({
  logos,
  reverse,
}: {
  logos: { src: string; alt: string }[];
  reverse?: boolean;
}) {
  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <div
        className={`flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-3 sm:h-24 sm:w-24"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsSection() {
  const t = useTranslations("clients");

  return (
    <section id="clients" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("heading")}</h2>
          <p className="mt-3 text-slate-600">{t("subheading")}</p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <MarqueeRow logos={CLIENT_LOGOS_ROW_1} />
          <MarqueeRow logos={CLIENT_LOGOS_ROW_2} reverse />
        </div>
      </div>
    </section>
  );
}
