import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SchemesView } from "@/features/schemes/schemes-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("schemes") };
}

export default function SchemesPage() {
  return <SchemesView />;
}