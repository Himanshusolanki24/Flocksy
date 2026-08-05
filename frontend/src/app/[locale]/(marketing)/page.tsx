import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LandingPage } from "@/features/landing/landing-page";
import { siteConfig } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: siteConfig.url,
    },
  };
}

export default function MarketingPage() {
  return <LandingPage />;
}