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
    <section id="geography" className="scroll-mt-20 bg-navy py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("heading")}</h2>
          <p className="mt-3 text-slate-300">{t("subheading")}</p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
                      fill={active ? "#2563eb" : "#1e293b"}
                      stroke="#0b1220"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: active ? "#3b82f6" : "#1e293b" },
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
                <circle r={5} fill="#2563eb" opacity={0.5} className="animate-ping" />
                <circle r={4} fill="#fff" stroke="#2563eb" strokeWidth={2} className="cursor-pointer" />
              </Marker>
            ))}
          </ComposableMap>

          {hovered && (
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-lg">
              {t(hovered)}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {countries.map((c) => (
            <span
              key={c.id}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white"
            >
              {t(c.nameKey)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
