"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useTranslations } from "next-intl";
import { countries, countryIds } from "@/lib/constants";

const GEO_URL = "/data/countries-110m.json";

export default function WorldMap() {
  const t = useTranslations("geography");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="geography" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{t("heading")}</h2>
          <p className="mt-5 text-slate-400">{t("subheading")}</p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/5 bg-surface">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [58, 35], scale: 500 }}
            className="h-[380px] w-full sm:h-[480px]"
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const active = countryIds.includes(geo.id as string);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={active ? "#498ef9" : "#0a3553"}
                      stroke="#001c2f"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: active ? "#2fdd8c" : "#0a3553" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {countries.map((c) => (
              <Marker
                key={c.id}
                coordinates={c.coordinates}
                onMouseEnter={() => setHovered(c.nameKey)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle r={5} fill="#2fdd8c" opacity={0.5} className="animate-ping" />
                <circle r={4} fill="#2fdd8c" stroke="#001c2f" strokeWidth={2} className="cursor-pointer" />
              </Marker>
            ))}
          </ComposableMap>

          {hovered && (
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-navy shadow-lg">
              {t(hovered)}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {countries.map((c) => (
            <span
              key={c.id}
              className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-sm font-medium text-slate-200"
            >
              {t(c.nameKey)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
