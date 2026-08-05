import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Global middleware: negotiates the locale from the URL/cookie, adds it to
 * the path when missing, and sets the `locale` cookie for client reads.
 */
export default createMiddleware(routing);

export const config = {
  // Skip internal paths and anything with a file extension (assets, images,
  // fonts, service worker, manifest, api routes).
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};