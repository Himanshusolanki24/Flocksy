import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReportsView } from "@/features/reports/reports-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("reports") };
}

export default function ReportsPage() {
  return <ReportsView />;
}