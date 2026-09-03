import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Root page - redirects to the default locale.
 * The middleware will handle locale negotiation for all other routes.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
