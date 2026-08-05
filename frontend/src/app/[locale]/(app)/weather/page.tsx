import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WeatherView } from "@/features/weather/weather-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("weather") };
}

export default function WeatherPage() {
  return <WeatherView />;
}