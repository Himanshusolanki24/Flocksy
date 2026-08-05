import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnalyticsView } from "@/features/analytics/analytics-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("analytics") };
}

export default function AnalyticsPage() {
  return <AnalyticsView />;
}