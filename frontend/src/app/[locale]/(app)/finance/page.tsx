import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FinanceView } from "@/features/finance/finance-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("finance") };
}

export default function FinancePage() {
  return <FinanceView />;
}