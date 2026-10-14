import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "ru", "kk"],
  defaultLocale: "uz",
  // Always open Uzbek by default instead of guessing from browser language / cookie
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
