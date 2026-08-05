import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CropAdvisorView } from "@/features/crop-advisor/crop-advisor-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("cropAdvisor") };
}

export default function CropAdvisorPage() {
  return <CropAdvisorView />;
}