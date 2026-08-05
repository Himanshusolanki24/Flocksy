import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MedicineView } from "@/features/medicine/medicine-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("medicine") };
}

export default function MedicinePage() {
  return <MedicineView />;
}