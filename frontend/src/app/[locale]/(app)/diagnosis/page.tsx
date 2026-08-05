import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DiagnosisView } from "@/features/diagnosis/diagnosis-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("diagnosis") };
}

export default function DiagnosisPage() {
  return <DiagnosisView />;
}