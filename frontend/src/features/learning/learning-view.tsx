"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlayCircle, Clock, Award, BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import { useLessons } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

const categoryEmoji: Record<Lesson["category"], string> = {
  poultry: "🐔",
  biosecurity: "🛡️",
  finance: "💰",
  health: "🩺",
};

export function LearningView() {
  const t = useTranslations("learning");
  const { data, isLoading, isError, refetch } = useLessons();
  const [tab, setTab] = useState("all");

  const lessons = (data ?? []).filter((l) => tab === "all" || l.category === tab);
  const completed = (data ?? []).filter((l) => l.completed);
  const totalPoints = (data ?? []).reduce((s, l) => s + (l.completed ? l.points : 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader
        icon={<GraduationCap className="h-6 w-6" />}
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="grid grid-cols-3 gap-4">
        <Summary icon={<CheckCircle2 className="h-5 w-5 text-success" />} label={t("lessonsCompleted")} value={String(completed.length)} />
        <Summary icon={<Award className="h-5 w-5 text-primary" />} label={t("points")} value={String(totalPoints)} />
        <Summary icon={<BookOpen className="h-5 w-5 text-warning" />} label={t("categories")} value={String(new Set((data ?? []).map((l) => l.category)).size)} />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-5">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">{t("categories")}</TabsTrigger>
          <TabsTrigger value="poultry">{t("poultry")}</TabsTrigger>
          <TabsTrigger value="biosecurity">Biosecurity</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="finance">{t("finance")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l) => (
            <Card key={l.id} className="p-4">
              <div className="flex items-start justify-between">
                <span className="text-2xl">{categoryEmoji[l.category]}</span>
                <Badge variant={l.completed ? "soft" : "secondary"} className={cn(l.completed && "text-success")}>
                  {l.completed ? t("lessonsCompleted") : t("continue")}
                </Badge>
              </div>
              <p className="mt-3 font-semibold leading-snug">{l.title}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {l.durationMin} {t("lessonDuration")}</span>
                <span className="flex items-center gap-1"><Award className="h-3 w-3" /> {l.points}</span>
              </div>
              <Button className="mt-4 w-full gap-2" variant={l.completed ? "outline" : "default"}>
                <PlayCircle className="h-4 w-4" />
                {l.completed ? t("watch") : t("startLesson")}
              </Button>
            </Card>
          ))}
        </div>
      </DataState>
    </div>
  );
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">{icon}</span>
      <p className="mt-3 text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}