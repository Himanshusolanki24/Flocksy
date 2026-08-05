"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Bot,
  ScanSearch,
  Wallet,
  Wheat,
  ChevronRight,
  BellRing,
  CloudSun,
  Activity,
  Check,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useDashboard, useWeather } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutChart, Sparkline, AreaTrend } from "@/components/charts";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/dates";
import { formatIndianNumber } from "@/lib/utils";

export function DashboardView() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <QuickActions />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FarmHealth />
          <TasksAndAlerts />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <WeatherMini />
          <AiInsights />
        </div>
      </div>
    </div>
  );
}

function DashboardHeader() {
  const t = useTranslations("dashboard");
  const user = useAuthStore((s) => s.user);
  const name = user?.name?.split(" ")[0] ?? "Farmer";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("greetingMorning", { name }) : hour < 17 ? t("greetingAfternoon", { name }) : t("greetingEvening", { name });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{greeting}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <Button asChild size="lg">
        <Link href="/assistant">
          <Bot className="mr-1" /> {t("askAi")}
        </Link>
      </Button>
    </div>
  );
}

const actions = [
  { href: "/assistant", icon: Bot, key: "askAi" },
  { href: "/diagnosis", icon: ScanSearch, key: "detectDisease" },
  { href: "/finance", icon: Wallet, key: "recordSale" },
  { href: "/feed", icon: Wheat, key: "addFeed" },
];

function QuickActions() {
  const t = useTranslations("dashboard");
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {actions.map(({ href, icon: Icon, key }) => (
        <Link
          key={key}
          href={href}
          className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft transition-all hover:shadow-lift active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium">{t(key)}</span>
        </Link>
      ))}
    </div>
  );
}

function FarmHealth() {
  const { data, isLoading } = useDashboard();
  const t = useTranslations("dashboard");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{t("farmHealth")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </div>
        <Badge variant="soft">✓ {t("allHealthy")}</Badge>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <DonutChart
            data={(data?.chartData ?? []).map((d) => ({ name: d.label, value: d.value, color: d.color }))}
            height={180}
            centerCaption={t("healthyBirds")}
            className="max-w-[220px]"
          />
        </div>
        <div className="space-y-3">
          <MiniMetric label={t("healthyBirds")} value={`${data?.healthyBirdRatio ?? 0}%`} tone="text-success" />
          <MiniMetric label={t("feedEfficiency")} value={`${data?.feedEfficiency ?? 0}%`} tone="text-primary" />
          <MiniMetric label={t("activeAlerts")} value={String(data?.activeAlerts ?? 0)} tone="text-warning" />
          <MemberBreakdown data={data?.chartData ?? []} />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-lg font-semibold", tone)}>{value}</span>
    </div>
  );
}

function MemberBreakdown({ data }: { data: { label: string; value: number; color?: string }[] }) {
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color ?? "var(--chart-1)" }} />
          <span className="flex-1 truncate text-muted-foreground">{item.label}</span>
          <span className="font-semibold">{formatIndianNumber(item.value)}%</span>
        </div>
      ))}
    </div>
  );
}

function TasksAndAlerts() {
  const { data, isLoading } = useDashboard();
  const t = useTranslations("dashboard");
  const [done, setDone] = useState<string[]>([]);

  const tasks = data?.tasks ?? [];
  const alerts = data?.alerts ?? [];

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-primary" /> {t("todayTasks")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? <TasksSkeleton /> : tasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("noTasks")}</p>
          ) : (
            tasks.map((task) => {
              const isDone = done.includes(task.id);
              return (
                <button
                  key={task.id}
                  onClick={() =>
                    setDone((prev) => (isDone ? prev.filter((id) => id !== task.id) : [...prev, task.id]))
                  }
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    isDone ? "border-transparent bg-muted/50" : "hover:bg-muted/40",
                  )}
                  aria-pressed={isDone}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      isDone ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                    )}
                  >
                    {isDone ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className={cn("flex-1 text-sm font-medium", isDone && "line-through opacity-60")}>
                    {task.title}
                  </span>
                  {task.priority === "high" && <Badge variant="destructive">{t("highPriority")}</Badge>}
                </button>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> {t("diseaseAlerts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? <TasksSkeleton /> : alerts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">—</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-xl border p-3">
                <AlertDot severity={alert.severity} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  {alert.note ? <p className="text-xs text-muted-foreground">{alert.note}</p> : null}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AlertDot({ severity }: { severity: "critical" | "warning" | "info" }) {
  const tone =
    severity === "critical" ? "bg-destructive" : severity === "warning" ? "bg-warning" : "bg-info";
  return <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", tone)} />;
}

function TasksSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function RecentActivity() {
  const { data } = useDashboard();
  const t = useTranslations("dashboard");
  const activities = data?.activities ?? [];
  const weekly = data?.weeklyTrend ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> {t("recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("noActivities")}</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {activity.meta ? <p className="text-xs text-muted-foreground">{activity.meta}</p> : null}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(activity.timestamp)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Weekly trend</CardTitle>
          <Badge variant="soft">↑ 6%</Badge>
        </CardHeader>
        <CardContent>
          <AreaTrend data={weekly.map((p) => ({ label: p.day, value: p.value }))} height={170} />
          <div className="mt-2 flex overflow-hidden rounded-lg">
            {weekly.map((p, i) => (
              <div key={i} className="flex-1 text-center text-xs text-muted-foreground">
                {p.value}%
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WeatherMini() {
  const { data } = useWeather();
  const t = useTranslations("dashboard");
  const daily = data?.daily ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-4 w-4 text-primary" /> {t("weatherToday")}
        </CardTitle>
        <Button asChild variant="ghost" size="sm" className="px-2">
          <Link href="/weather">
            {t("viewWeather")} <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">{data?.tempC ?? "–"}°</span>
          <div className="flex-1 space-y-0.5 text-sm">
            <Sparkline values={daily.map((d) => d.maxTempC)} height={36} />
            <p className="text-xs text-muted-foreground">
              H {daily[0]?.maxTempC ?? "–"}° · L {daily[0]?.minTempC ?? "–"}°
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center">
          {daily.slice(0, 3).map((d) => (
            <div key={d.date} className="rounded-lg bg-muted/40 py-2">
              <p className="text-xs text-muted-foreground">{d.date}</p>
              <p className="text-sm font-semibold">{d.maxTempC}°</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AiInsights() {
  const t = useTranslations("dashboard");
  const { data } = useDashboard();
  const insights = data?.recentDetections ?? [];

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> {t("aiInsights")}
        </CardTitle>
        <Button asChild variant="ghost" size="sm" className="px-2">
          <Link href="/assistant">
            {t("viewAll")} <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((d, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border bg-background p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{d.disease}</p>
              <p className="text-xs text-muted-foreground">
                Confidence {Math.round(d.confidence * 100)}% · {timeAgo(d.timestamp)}
              </p>
            </div>
            <Badge variant="warning">{Math.round(d.confidence * 100)}%</Badge>
          </div>
        ))}
        {insights.length === 0 ? <p className="text-sm text-muted-foreground">—</p> : null}
      </CardContent>
    </Card>
  );
}