import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VetsView } from "@/features/vets/vets-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("vets") };
}

export default function VetsPage() {
  return <VetsView />;
}