import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VaccinationView } from "@/features/vaccination/vaccination-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("vaccination") };
}

export default function VaccinationPage() {
  return <VaccinationView />;
}