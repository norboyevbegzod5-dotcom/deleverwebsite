import { useTranslations } from "next-intl";

const CLIENT_LOGOS = [
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

const SALES_CHANNEL_LOGOS = [
  { src: "/channel-telegram.webp", alt: "Telegram" },
  { src: "/channel-instagram.png", alt: "Instagram" },
  { src: "/channel-yandex-eats.jpg", alt: "Yandex Eats" },
  { src: "/channel-tezkor.png", alt: "Tezkor" },
];

export default function TrustStrip() {
  const t = useTranslations("trust");

  return (
    <div
      id="clients"
      className="mt-16 grid scroll-mt-24 overflow-hidden rounded-3xl border border-white/5 bg-surface/60 lg:grid-cols-[1fr_auto]"
    >
      <div className="min-w-0 px-6 py-6">
        <p className="eyebrow !text-slate-500">{t("clientsLabel")}</p>
        <div
          className="mt-4 overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        >
          <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-2 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-6 lg:border-t-0 lg:border-l">
        <p className="eyebrow !text-slate-500">{t("channelsLabel")}</p>
        <div className="mt-4 flex items-center gap-3">
          {SALES_CHANNEL_LOGOS.map((logo) => (
            <span
              key={logo.src}
              className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt} className="h-full w-full object-cover" />
            </span>
          ))}
          <span className="ml-1 text-sm font-semibold text-white">+40</span>
        </div>
      </div>
    </div>
  );
}
