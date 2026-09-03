"use client";

import { useTranslations } from "next-intl";
import { MapPin, Droplets, Wind, Sun, Umbrella, Sunrise, Sunset, AlertTriangle, LocateFixed, CloudSun } from "lucide-react";
import { useWeather } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaTrend } from "@/components/charts";

const conditionIcon: Record<string, string> = {
  "clear-sky": "☀️",
  "partly-cloudy": "⛅",
  "light-rain": "🌦️",
  "moderate-rain": "🌧️",
  thunderstorm: "⛈️",
  sunny: "☀️",
};

export function WeatherView() {
  const t = useTranslations("weather");
  const { data, isLoading, isError, refetch } = useWeather();
  const unit = "c" as const;

  const toF = (c: number) => Math.round(c * 1.8 + 32);
  const temp = (c: number) => (unit === "c" ? c : toF(c));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader
        icon={<CloudSun className="h-6 w-6" />}
        title={t("title")}
        description={t("subtitle")}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" /> {data?.location ?? "—"}
            </Badge>
            <Button variant="outline" size="sm" className="gap-1">
              <LocateFixed className="h-3.5 w-3.5" /> {t("locationDetect")}
            </Button>
          </div>
        }
      />

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        {data ? (
          <div className="space-y-5">
            {/* Alerts */}
            {data.alerts.length > 0 ? (
              <div className="space-y-2">
                {data.alerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <div>
                      <p className="font-semibold">{t(a.type === "heat" ? "heatAlert" : a.type === "rain" ? "rainAlert" : "frostAlert")}</p>
                      <p className="text-muted-foreground">{a.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Current */}
            <Card>
              <CardContent className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
                <div className="flex flex-col justify-center">
                  <p className="text-4xl font-bold tracking-tight">
                    {temp(data.tempC)}°{unit.toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {conditionIcon[data.condition]} {t(data.condition)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("feelsLike")}: {temp(data.feelsLikeC)}°{unit.toUpperCase()} · {t("today")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Metric icon={<Droplets className="h-4 w-4" />} label={t("humidity")} value={`${data.humidity}%`} />
                  <Metric icon={<Wind className="h-4 w-4" />} label={t("wind")} value={`${data.windKph} km/h`} />
                  <Metric icon={<Sun className="h-4 w-4" />} label={t("uv")} value={String(data.uvIndex)} />
                  <Metric icon={<Umbrella className="h-4 w-4" />} label={t("precipitation")} value={`${data.precipitationChance}%`} />
                  <Metric icon={<Sunrise className="h-4 w-4" />} label={t("sunrise")} value={data.sunrise} />
                  <Metric icon={<Sunset className="h-4 w-4" />} label={t("sunset")} value={data.sunset} />
                </div>
              </CardContent>
            </Card>

            {/* Hourly */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("hourly")}</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaTrend
                  data={data.hourly.map((h) => ({ label: h.time, value: h.tempC }))}
                  height={180}
                />
              </CardContent>
            </Card>

            {/* Daily */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("daily")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.daily.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border px-4 py-3">
                    <span className="w-12 text-sm font-medium">{d.date}</span>
                    <span className="text-xl">{conditionIcon[d.condition] ?? "☀️"}</span>
                    <div className="ml-auto text-right text-sm">
                      <span className="font-semibold">{temp(d.maxTempC)}°</span>
                      <span className="text-muted-foreground"> / {temp(d.minTempC)}°</span>
                    </div>
                    <Badge variant="soft">{d.precipitationChance}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DataState>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5">
      <span className="text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}