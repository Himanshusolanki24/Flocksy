import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LearningView } from "@/features/learning/learning-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("learning") };
}

export default function LearningPage() {
  return <LearningView />;
}