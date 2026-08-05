import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FeedView } from "@/features/feed/feed-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("feed") };
}

export default function FeedPage() {
  return <FeedView />;
}