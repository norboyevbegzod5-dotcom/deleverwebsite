import { z } from "zod";

export const branchValues = ["1", "2_3", "4_10", "over_10"] as const;
export const posValues = ["iiko", "clopos", "alisa", "poster", "rkeeper", "jowi", "none"] as const;
export const orderRangeValues = ["1_20", "20_50", "50_100", "over_100"] as const;
export const aggregatorValues = ["uzum_tezkor", "yandex", "other", "none"] as const;
export const moduleValues = [
  "sales_channels",
  "operations",
  "courier_management",
  "crm",
  "analytics",
  "other",
] as const;

export const leadObjectSchema = z.object({
  // Empty when the lead is only planning to open (planning === true).
  location: z.string().trim().max(150),
  planning: z.boolean().optional().default(false),
  branches: z.enum(branchValues),
  pos: z.enum(posValues),
  ordersPerDay: z.enum(orderRangeValues),
  aggregators: z.array(z.enum(aggregatorValues)).min(1),
  deliverySystem: z.string().trim().min(2).max(300),
  modules: z.array(z.enum(moduleValues)).min(1),
  otherText: z.string().trim().max(300).optional().default(""),
  restaurantName: z.string().trim().min(2).max(150),
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{9,17}$/),
  telegram: z
    .string()
    .trim()
    .regex(/^@?[a-zA-Z0-9_]{3,32}$/)
    .optional()
    .or(z.literal("")),
  locale: z.enum(["uz", "ru", "kk"]),
  // Honeypot field: legitimate users never fill this in (hidden via CSS).
  website: z.string().max(0).optional().default(""),
});

export function requireOtherText(data: { modules: string[]; otherText: string }) {
  return !data.modules.includes("other") || data.otherText.length > 0;
}

export function requireLocation(data: { location: string; planning: boolean }) {
  return data.planning || data.location.length >= 2;
}

// Businesses without a POS system or with 1–20 deliveries a day are not a fit;
// the form stops them before the last step and the API rejects them too.
export function isQualified(data: { pos: string; ordersPerDay: string }) {
  return data.pos !== "none" && data.ordersPerDay !== "1_20";
}

export const leadSchema = leadObjectSchema
  .refine(requireOtherText, {
    message: "otherText required when 'other' is selected",
    path: ["otherText"],
  })
  .refine(requireLocation, { message: "location required", path: ["location"] });

export type LeadFormValues = z.infer<typeof leadSchema>;
