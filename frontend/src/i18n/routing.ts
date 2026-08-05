import { defineRouting } from "next-intl/routing";

/**
 * Supported locales for the Flocksy platform.
 * English and Hindi ship today; the array is intentionally
 * data-driven so regional languages can be added without code changes.
 */
export const routing = defineRouting({
  locales: ["en", "hi"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const defaultLocale: Locale = routing.defaultLocale;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (routing.locales as readonly string[]).includes(value);
}