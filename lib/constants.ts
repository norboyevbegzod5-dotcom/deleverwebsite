export type CountryMarker = {
  id: string; // ISO 3166-1 numeric code, matches public/data/countries-110m.json
  nameKey: "uzbekistan" | "kazakhstan" | "cyprus" | "georgia" | "uae" | "kyrgyzstan";
  coordinates: [number, number]; // [longitude, latitude]
};

export const countries: CountryMarker[] = [
  { id: "860", nameKey: "uzbekistan", coordinates: [69.2401, 41.2995] },
  { id: "398", nameKey: "kazakhstan", coordinates: [76.8512, 43.222] },
  { id: "196", nameKey: "cyprus", coordinates: [33.3823, 35.1856] },
  { id: "268", nameKey: "georgia", coordinates: [44.8271, 41.7151] },
  { id: "784", nameKey: "uae", coordinates: [55.2708, 25.2048] },
  { id: "417", nameKey: "kyrgyzstan", coordinates: [74.5698, 42.8746] },
];

export const countryIds = countries.map((c) => c.id);

export type ModuleDef = {
  id: "sales_channels" | "operations" | "courier_management" | "crm" | "analytics";
  titleKey: string;
  descKey: string;
};

export const modules: ModuleDef[] = [
  { id: "sales_channels", titleKey: "salesChannelsTitle", descKey: "salesChannelsDesc" },
  { id: "operations", titleKey: "operationsTitle", descKey: "operationsDesc" },
  { id: "courier_management", titleKey: "courierTitle", descKey: "courierDesc" },
  { id: "crm", titleKey: "crmTitle", descKey: "crmDesc" },
  { id: "analytics", titleKey: "analyticsTitle", descKey: "analyticsDesc" },
];

export const highlights = [
  "highlightsIntegrations",
  "highlightsUptime",
  "highlightsSupport",
  "highlightsLaunch",
] as const;

export const stats = [
  { valueKey: "businessesValue", labelKey: "businessesLabel" },
  { valueKey: "countriesValue", labelKey: "countriesLabel" },
  { valueKey: "ordersValue", labelKey: "ordersLabel" },
  { valueKey: "integrationsValue", labelKey: "integrationsLabel" },
] as const;

// Option lists for the step-by-step lead form. Values must match lib/validation.ts;
// labels without a key are brand names shown as-is in every language.
export const branchOptions = [
  { value: "1", label: "1" },
  { value: "2_3", label: "2–3" },
  { value: "4_10", label: "4–10" },
  { value: "over_10", label: "10+" },
] as const;

export const posOptions = [
  { value: "iiko", label: "iiko" },
  { value: "clopos", label: "Clopos" },
  { value: "alisa", label: "Alisa" },
  { value: "poster", label: "Poster" },
  { value: "rkeeper", label: "R-Keeper" },
  { value: "jowi", label: "Jowi" },
  { value: "none", labelKey: "posNone" },
] as const;

export const orderRangeOptions = [
  { value: "1_20", label: "1–20" },
  { value: "20_50", label: "20–50" },
  { value: "50_100", label: "50–100" },
  { value: "over_100", label: "100+" },
] as const;

export const aggregatorOptions = [
  { value: "uzum_tezkor", label: "Uzum Tezkor" },
  { value: "yandex", label: "Yandex" },
  { value: "other", labelKey: "aggOther" },
  { value: "none", labelKey: "aggNone" },
] as const;

export const problemOptions = [
  { value: "sales_channels", labelKey: "moduleSalesChannels" },
  { value: "operations", labelKey: "moduleOperations" },
  { value: "courier_management", labelKey: "moduleCourierManagement" },
  { value: "crm", labelKey: "moduleCrm" },
  { value: "analytics", labelKey: "moduleAnalytics" },
  { value: "other", labelKey: "moduleOther" },
] as const;
