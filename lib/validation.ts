import { z } from "zod";

export const orderRangeValues = ["10_30", "30_50", "over_50"] as const;
export const moduleValues = [
  "sales_channels",
  "operations",
  "courier_management",
  "crm",
  "analytics",
  "other",
] as const;

export const leadObjectSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{9,17}$/),
  telegram: z
    .string()
    .trim()
    .regex(/^@?[a-zA-Z0-9_]{3,32}$/),
  restaurantName: z.string().trim().min(2).max(150),
  ordersPerDay: z.enum(orderRangeValues),
  modules: z.array(z.enum(moduleValues)).min(1),
  otherText: z.string().trim().max(300).optional().default(""),
  locale: z.enum(["uz", "ru", "kk"]),
  // Honeypot field: legitimate users never fill this in (hidden via CSS).
  website: z.string().max(0).optional().default(""),
});

export function requireOtherText(data: { modules: string[]; otherText: string }) {
  return !data.modules.includes("other") || data.otherText.length > 0;
}

export const leadSchema = leadObjectSchema.refine(requireOtherText, {
  message: "otherText required when 'other' is selected",
  path: ["otherText"],
});

export type LeadFormValues = z.infer<typeof leadSchema>;
