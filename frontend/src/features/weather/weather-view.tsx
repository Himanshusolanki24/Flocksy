"use client";

import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Droplets,
  Wind,
  Sun,
  Umbrella,
  Sunrise,
  Sunset,
  AlertTriangle,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSun,
  Bird,
} from "lucide-react";
import { useWeather } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaTrend } from "@/components/charts";
import { cn } from "@/lib/utils";
import type { WeatherCondition } from "@/types";

/** Data uses kebab-case conditions; messages and icons are keyed off this map. */
const conditions: Record<
  WeatherCondition,
  { key: string; icon: ComponentType<{ className?: string }> }
> = {
  clear: { key: "clearSky", icon: Sun },
  sunny: { key: "sunny", icon: Sun },
  "partly-cloudy": { key: "partlyCloudy", icon: CloudSun },
  "light-rain": { key: "lightRain", icon: CloudRain },
  "moderate-rain": { key: "moderateRain", icon: CloudRain },
  thunderstorm: { key: "thunderstorm", icon: CloudLightning },
};

const conditionOf = (c: WeatherCondition) =>
  conditions[c] ?? { key: "sunny", icon: Cloud };

export function WeatherView() {
  const t = useTranslations("weather");
  const { data, isLoading, isError, refetch } = useWeather();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm">
            <MapPin className="h-3.5 w-3.5" /> {data?.location ?? "—"}
          </Badge>
        }
      />

      <DataState
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      >
        {data ? (
          <div className="space-y-6">
            {data.alerts.length > 0 ? (
              <div className="space-y-2">
                {data.alerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4"
                  >
                    <AlertTriangle
                      className="mt-0.5 h-5 w-5 shrink-0 text-warning"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {t(
                          a.type === "heat"
                            ? "heatAlert"
                            : a.type === "rain"
                              ? "rainAlert"
                              : "frostAlert",
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {a.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <CurrentCard data={data} />
            <FarmImpactCard
              tempC={data.tempC}
              rainChance={data.precipitationChance}
            />

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("hourly")}</CardTitle>
                <CardDescription>{t("next12h")}</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaTrend
                  data={data.hourly.map((h) => ({
                    label: h.time,
                    value: h.tempC,
                  }))}
                  height={190}
                  showGrid
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t("daily")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.daily.map((d, i) => {
                  const { key, icon: Icon } = conditionOf(d.condition);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border p-3"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{d.date}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t(key)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold">
                          {d.maxTempC}°{" "}
                          <span className="text-muted-foreground">
                            / {d.minTempC}°
                          </span>
                        </p>
                        <p className="flex items-center justify-end gap-1 text-xs text-info">
                          <Umbrella className="h-3 w-3" aria-hidden />{" "}
                          {d.precipitationChance}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DataState>
    </div>
  );
}

function CurrentCard({
  data,
}: {
  data: NonNullable<ReturnType<typeof useWeather>["data"]>;
}) {
  const t = useTranslations("weather");
  const { key, icon: Icon } = conditionOf(data.condition);

  const metrics = [
    { icon: Droplets, label: t("humidity"), value: `${data.humidity}%` },
    { icon: Wind, label: t("wind"), value: `${data.windKph} km/h` },
    { icon: Sun, label: t("uv"), value: String(data.uvIndex) },
    {
      icon: Umbrella,
      label: t("precipitation"),
      value: `${data.precipitationChance}%`,
    },
    { icon: Sunrise, label: t("sunrise"), value: data.sunrise },
    { icon: Sunset, label: t("sunset"), value: data.sunset },
  ];

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-8 w-8" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-5xl font-bold tracking-tight">{data.tempC}°</p>
            <p className="mt-1 font-medium">{t(key)}</p>
            <p className="text-sm text-muted-foreground">
              {t("feelsLike")} {data.feelsLikeC}° · {t("today")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {metrics.map(({ icon: MetricIcon, label, value }) => (
            <div key={label} className="rounded-xl bg-muted/50 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MetricIcon className="h-3.5 w-3.5" aria-hidden /> {label}
              </p>
              <p className="mt-1 truncate text-base font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** The part that matters: what the farmer should actually do about the weather. */
function FarmImpactCard({
  tempC,
  rainChance,
}: {
  tempC: number;
  rainChance: number;
}) {
  const t = useTranslations("weather");
  const risk = tempC >= 35 ? "high" : tempC >= 30 ? "medium" : "low";
  const riskLabel =
    risk === "high"
      ? t("riskHigh")
      : risk === "medium"
        ? t("riskMedium")
        : t("riskLow");
  const riskStyle =
    risk === "high"
      ? "bg-destructive/10 text-destructive"
      : risk === "medium"
        ? "bg-warning/15 text-warning"
        : "bg-success/10 text-success";

  const tips = [
    { icon: Droplets, label: t("tipWater") },
    { icon: Wind, label: t("tipVentilation") },
    { icon: Bird, label: t("tipPanting") },
    ...(rainChance >= 40 ? [{ icon: Umbrella, label: t("tipRain") }] : []),
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">{t("farmImpact")}</CardTitle>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            riskStyle,
          )}
        >
          {riskLabel}
        </span>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 sm:grid-cols-2">
          {tips.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-start gap-3 rounded-xl border p-3 text-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="leading-relaxed">{label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
