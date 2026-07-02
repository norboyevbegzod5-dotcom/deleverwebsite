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

export const orderRangeOptions = [
  { value: "10_30", labelKey: "ordersOption1" },
  { value: "30_50", labelKey: "ordersOption2" },
  { value: "over_50", labelKey: "ordersOption3" },
] as const;
