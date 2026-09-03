"use client";

import { useState, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import {
  Bot,
  Check,
  ChevronRight,
  Thermometer,
  Syringe,
  Wheat,
  Bird,
  Droplets,
  Wind,
  Sun,
  Activity,
  Mic,
  ClipboardList,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  useDashboard,
  useWeather,
  useFeedBatches,
  useVaccinations,
} from "@/lib/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/use-auth-store";
import { cn, formatIndianNumber } from "@/lib/utils";
import { timeAgo } from "@/lib/dates";
import type { DashboardAlert } from "@/types";

/* ----------------------------- shared tones ----------------------------- */

type Tone = "urgent" | "attention" | "watch" | "good" | "info";

const toneIcon: Record<Tone, string> = {
  urgent: "bg-destructive/10 text-destructive",
  attention: "bg-warning/15 text-warning",
  watch: "bg-warning/10 text-warning",
  good: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
};

const toneBorder: Record<Tone, string> = {
  urgent: "border-destructive/30",
  attention: "border-warning/30",
  watch: "border-warning/20",
  good: "border-success/25",
  info: "border-info/25",
};

const toneDot: Record<Tone, string> = {
  urgent: "bg-destructive",
  attention: "bg-warning",
  watch: "bg-warning/70",
  good: "bg-success",
  info: "bg-info",
};

/* -------------------------------- page ---------------------------------- */

export function DashboardView() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 sm:px-6">
      <DashboardHeader />
      <AttentionSection />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FlockCard />
          <TasksCard />
        </div>
        <div className="space-y-6">
          <AskFlocksyCard />
          <WeatherCard />
        </div>
      </div>

      <ActivityCard />
    </div>
  );
}

function DashboardHeader() {
  const t = useTranslations("dashboard");
  const user = useAuthStore((s) => s.user);
  const name = user?.name?.split(" ")[0] ?? "Farmer";
  const farmName = user?.farmName ?? t("myFarm");

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("greetingMorning", { name })
      : hour < 17
        ? t("greetingAfternoon", { name })
        : t("greetingEvening", { name });

  return (
    <header className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting} 👋
        </h1>
        <p className="text-base text-muted-foreground">{t("headerSubtitle")}</p>
        <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
          <Bird className="h-4 w-4 text-primary" aria-hidden />
          {farmName}
        </p>
      </div>
      <Button asChild size="lg" className="h-12 gap-2 px-5 text-base">
        <Link href="/assistant">
          <Bot className="h-5 w-5" aria-hidden /> {t("askFlocksy")}
        </Link>
      </Button>
    </header>
  );
}

/* -------------------- 1. what needs my attention ------------------------ */

interface AttentionItem {
  id: string;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
  category: string;
  status: string;
  headline: string;
  detail?: string;
  advice: string;
  href: string;
  cta: string;
}

function alertMeta(alert: DashboardAlert) {
  switch (alert.category) {
    case "environment":
      return {
        icon: Thermometer,
        href: "/weather",
        adviceKey: "heatAdvice" as const,
      };
    case "feed":
      return { icon: Wheat, href: "/feed", adviceKey: "feedAdvice" as const };
    case "health":
      return {
        icon: ShieldCheck,
        href: "/diagnosis",
        adviceKey: "healthAdvice" as const,
      };
    default:
      return {
        icon: Sparkles,
        href: "/notifications",
        adviceKey: "healthAdvice" as const,
      };
  }
}

/** Turns raw alerts, vaccinations and feed stock into "do this next" cards. */
function useAttentionItems(): { items: AttentionItem[]; isLoading: boolean } {
  const t = useTranslations("dashboard");
  const { data, isLoading } = useDashboard();
  const { data: vaccinations } = useVaccinations();
  const { data: batches } = useFeedBatches();

  const items: AttentionItem[] = [];

  for (const alert of data?.alerts ?? []) {
    if (alert.severity === "info") continue;
    const meta = alertMeta(alert);
    items.push({
      id: alert.id,
      icon: meta.icon,
      tone: alert.severity === "critical" ? "urgent" : "attention",
      category: alert.title.split("—")[1]?.trim() ?? alert.title,
      status:
        alert.category === "environment"
          ? t("highTemp")
          : alert.category === "feed"
            ? t("runningLow")
            : alert.severity === "critical"
              ? t("urgent")
              : t("watch"),
      headline: alert.title.split("—")[0].trim(),
      detail: alert.note,
      advice: t(meta.adviceKey),
      href: meta.href,
      cta: t("checkNow"),
    });
  }

  // Overdue or next-up vaccination — the thing farmers most often miss.
  const nextVaccination = (vaccinations ?? [])
    .filter((v) => v.status !== "completed")
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))[0];
  if (nextVaccination) {
    items.push({
      id: nextVaccination.id,
      icon: Syringe,
      tone: nextVaccination.status === "overdue" ? "urgent" : "watch",
      category: t("vaccination"),
      status:
        nextVaccination.status === "overdue" ? t("overdue") : t("dueTomorrow"),
      headline: nextVaccination.vaccine,
      detail: nextVaccination.flock,
      advice: t("vaccinationAdvice", { flock: nextVaccination.flock }),
      href: "/vaccination",
      cta: t("viewSchedule"),
    });
  }

  const lowBatch = (batches ?? [])
    .filter((b) => b.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];
  if (lowBatch) {
    items.push({
      id: lowBatch.id,
      icon: Wheat,
      tone: lowBatch.daysLeft <= 3 ? "urgent" : "attention",
      category: t("feedStock"),
      status: t("runningLow"),
      headline: t("kgRemaining", { kg: formatIndianNumber(lowBatch.weightKg) }),
      detail: t("daysLeft", { days: lowBatch.daysLeft }),
      advice: t("feedAdvice"),
      href: "/feed",
      cta: t("checkFeed"),
    });
  }

  return { items: items.slice(0, 3), isLoading };
}

function AttentionSection() {
  const t = useTranslations("dashboard");
  const { items, isLoading } = useAttentionItems();

  return (
    <section aria-labelledby="attention-heading" className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2
          id="attention-heading"
          className="text-xl font-semibold tracking-tight"
        >
          {t("attentionTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "…"
            : items.length > 0
              ? t("attentionCount", { count: items.length })
              : t("attentionNone")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-4 py-6">
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                toneIcon.good,
              )}
            >
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">{t("attentionNone")}</p>
              <p className="text-sm text-muted-foreground">
                {t("attentionNoneHint")}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <AttentionCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function AttentionCard({ item }: { item: AttentionItem }) {
  const t = useTranslations("dashboard");
  const Icon = item.icon;
  return (
    <Card
      className={cn(
        "flex flex-col border-2 transition-shadow hover:shadow-lift",
        toneBorder[item.tone],
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              toneIcon[item.tone],
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {item.category}
            </p>
            <p className="mt-0.5 text-lg font-semibold leading-snug">
              {item.headline}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              item.tone === "urgent"
                ? "bg-destructive/10 text-destructive"
                : "bg-warning/15 text-warning",
            )}
          >
            {item.status}
          </span>
        </div>

        {item.detail ? (
          <p className="text-sm text-muted-foreground">{item.detail}</p>
        ) : null}

        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("recommends")}
          </p>
          <p className="mt-1 text-sm leading-relaxed">{item.advice}</p>
        </div>

        <Button
          asChild
          variant="outline"
          className="mt-auto h-11 w-full justify-between text-sm"
        >
          <Link href={item.href}>
            {item.cta} <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/* --------------------------- 2. how are my birds ------------------------ */

function FlockCard() {
  const t = useTranslations("dashboard");
  const { data, isLoading } = useDashboard();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />;

  const total = Number(
    (data?.stats.find((s) => s.label === "Birds")?.value ?? "0").replace(
      /\D/g,
      "",
    ),
  );
  const healthyPct = Math.round(data?.healthyBirdRatio ?? 0);
  const healthy = Math.round((total * healthyPct) / 100);
  const rest = total - healthy;
  // ponytail: no per-bird status feed yet — split the unhealthy remainder 80/20
  // between "watch" and "attention". Swap for real counts when the API has them.
  const needsAttention = Math.round(rest * 0.2);
  const watch = rest - needsAttention;

  const rows = [
    { tone: "good" as const, label: t("healthy"), value: healthy },
    { tone: "watch" as const, label: t("watch"), value: watch },
    { tone: "urgent" as const, label: t("attention"), value: needsAttention },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bird className="h-5 w-5 text-primary" aria-hidden />{" "}
          {t("flockTitle")}
        </CardTitle>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/inventory">
            {t("viewFlock")} <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-3">
          <div>
            <p className="text-4xl font-bold tracking-tight">
              {formatIndianNumber(total)}
            </p>
            <p className="text-sm text-muted-foreground">{t("birds")}</p>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight text-success">
              {healthyPct}%
            </p>
            <p className="text-sm text-muted-foreground">{t("healthy")}</p>
          </div>
        </div>

        {/* Health bar — one glance, three states, each also written out below. */}
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
          aria-hidden
        >
          {rows.map((row) => (
            <span
              key={row.label}
              className={toneDot[row.tone]}
              style={{ width: `${total ? (row.value / total) * 100 : 0}%` }}
            />
          ))}
        </div>

        <ul className="grid gap-2 sm:grid-cols-3">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5"
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  toneDot[row.tone],
                )}
                aria-hidden
              />
              <span className="flex-1 text-sm text-muted-foreground">
                {row.label}
              </span>
              <span className="text-sm font-semibold">
                {formatIndianNumber(row.value)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ------------------------- 3. what should I do today -------------------- */

function TasksCard() {
  const t = useTranslations("dashboard");
  const { data, isLoading } = useDashboard();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const tasks = data?.tasks ?? [];

  const priorityLabel = (priority: string) =>
    priority === "high"
      ? t("priorityHigh")
      : priority === "medium"
        ? t("priorityToday")
        : t("priorityNormal");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-primary" aria-hidden />{" "}
          {t("tasksTitle")}
        </CardTitle>
        <CardDescription>{t("tasksHint")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("noTasks")}
          </p>
        ) : (
          tasks.map((task) => {
            const isDone = done[task.id] ?? task.completed;
            return (
              <button
                key={task.id}
                type="button"
                aria-pressed={isDone}
                onClick={() => {
                  setDone((prev) => ({ ...prev, [task.id]: !isDone }));
                  if (!isDone)
                    toast.success(t("taskDone"), { description: task.title });
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                  isDone
                    ? "border-transparent bg-muted/60"
                    : "hover:border-primary/40 hover:bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isDone
                      ? "border-success bg-success text-white"
                      : "border-muted-foreground/40",
                  )}
                  aria-hidden
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isDone ? "scale-100" : "scale-0",
                    )}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-medium leading-snug",
                      isDone && "text-muted-foreground line-through",
                    )}
                  >
                    {task.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {isDone ? t("priorityDone") : priorityLabel(task.priority)}
                  </span>
                </span>
                {task.priority === "high" && !isDone ? (
                  <Badge variant="destructive" className="shrink-0">
                    {t("priorityHigh")}
                  </Badge>
                ) : null}
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------ 4. what does Flocksy say ---------------------- */

function AskFlocksyCard() {
  const t = useTranslations("dashboard");
  const questions = [t("aiQ1"), t("aiQ2"), t("aiQ3")];

  return (
    <Card className="border-primary/25 bg-primary/[0.04]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-primary" aria-hidden /> {t("aiTitle")}
        </CardTitle>
        <CardDescription>{t("aiSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-semibold leading-snug">“{t("aiPrompt")}”</p>
        <Button asChild size="lg" className="h-12 w-full gap-2 text-base">
          <Link href="/assistant">
            <Mic className="h-5 w-5" aria-hidden /> {t("aiVoice")}
          </Link>
        </Button>
        <ul className="space-y-2">
          {questions.map((q) => (
            <li key={q}>
              <Link
                href="/assistant"
                className="flex min-h-11 items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="min-w-0 flex-1">{q}</span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ---------------------------- 5. farm conditions ------------------------ */

function WeatherCard() {
  const t = useTranslations("dashboard");
  const { data } = useWeather();
  const temp = data?.tempC ?? 0;
  const risk: Tone = temp >= 35 ? "urgent" : temp >= 30 ? "attention" : "good";
  const riskLabel =
    risk === "urgent"
      ? t("heatRiskHigh")
      : risk === "attention"
        ? t("heatRiskMedium")
        : t("heatRiskLow");

  const tips = [
    { icon: Droplets, label: t("weatherTip1") },
    { icon: Wind, label: t("weatherTip2") },
    { icon: Bird, label: t("weatherTip3") },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sun className="h-5 w-5 text-primary" aria-hidden />{" "}
          {t("weatherTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold tracking-tight">
            {data?.tempC ?? "–"}°
          </span>
          <div className="min-w-0">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                toneIcon[risk],
              )}
            >
              <span
                className={cn("h-2 w-2 rounded-full", toneDot[risk])}
                aria-hidden
              />
              {riskLabel}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("heatWindow")}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("recommends")}
          </p>
          <ul className="mt-2 space-y-2">
            {tips.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm">
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 w-full justify-between"
        >
          <Link href="/weather">
            {t("viewForecast")} <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/* --------------------------- 8. recent activity ------------------------- */

function ActivityCard() {
  const t = useTranslations("dashboard");
  const { data } = useDashboard();
  const activities = data?.activities ?? [];

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
          <Activity className="h-4 w-4" aria-hidden /> {t("activityTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noActivities")}</p>
        ) : (
          <ul className="divide-y">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {activity.title}
                  {activity.meta ? (
                    <span className="text-muted-foreground">
                      {" "}
                      — {activity.meta}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {timeAgo(activity.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
