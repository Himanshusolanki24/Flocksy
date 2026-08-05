import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CommunityView } from "@/features/community/community-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("community") };
}

export default function CommunityPage() {
  return <CommunityView />;
}