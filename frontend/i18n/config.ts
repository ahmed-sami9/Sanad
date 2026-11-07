// "ar" joins this list when Arabic ships.
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const rtlLocales: readonly string[] = ["ar"];

export function getDirection(locale: string): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
