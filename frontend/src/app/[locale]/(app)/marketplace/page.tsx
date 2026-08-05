import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketplaceView } from "@/features/marketplace/marketplace-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("marketplace") };
}

export default function MarketplacePage() {
  return <MarketplaceView />;
}