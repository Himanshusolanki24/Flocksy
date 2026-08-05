import { getRequestConfig } from "next-intl/server";
import { routing, isLocale } from "./routing";

/**
 * Resolves request-scoped configuration (locale + translations) for the
 * entire app. The resolved locale is read from the URL segment (via the
 * middleware) and falls back to the default locale.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Reload the messages ONLY when the locale changes to avoid stale caches.
    messages: (
      await import(/* webpackChunkName: "messages" */ `../../messages/${locale}.json`)
    ).default,
  };
});