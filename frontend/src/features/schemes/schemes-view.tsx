"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Landmark, CalendarClock, BadgeCheck, ExternalLink } from "lucide-react";
import { useSchemes } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { SchemeCategory } from "@/types";

const categoryEmoji: Record<SchemeCategory, string> = {
  poultry: "🐔",
  dairy: "🥛",
  crop: "🌾",
  insurance: "🛡️",
  loan: "🏦",
};

export function SchemesView() {
  const t = useTranslations("schemes");
  const { data, isLoading, isError, refetch } = useSchemes();
  const [tab, setTab] = useState("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const schemes = (data ?? []).filter((s) => tab === "all" || s.category === tab);
  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="poultry">{t("poultry")}</TabsTrigger>
          <TabsTrigger value="dairy">{t("dairy")}</TabsTrigger>
          <TabsTrigger value="crop">{t("crop")}</TabsTrigger>
          <TabsTrigger value="insurance">{t("insurance")}</TabsTrigger>
          <TabsTrigger value="loan">{t("loan")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {schemes.map((s) => {
            const eligible = s.open;
            return (
              <Card key={s.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl">
                      {categoryEmoji[s.category] ?? "🏛️"}
                    </span>
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.ministry}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className={cn("shrink-0", saved.has(s.id) && "text-primary")} onClick={() => toggleSave(s.id)}>
                    {saved.has(s.id) ? "★" : "☆"}
                  </Button>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span><span className="text-muted-foreground">{t("benefit")}: </span><strong>{s.benefit}</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span><span className="text-muted-foreground">{t("eligibility")}: </span>{s.eligibility}</span>
                  </div>
                  {s.deadline ? (
                    <div className="flex items-start gap-2">
                      <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      <span><span className="text-muted-foreground">{t("deadline")}: </span>{s.deadline}</span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge variant={eligible ? "soft" : "secondary"} className={cn(eligible && "text-success")}>
                    {t(eligible ? "eligible" : "applying")}
                  </Badge>
                  <Button asChild variant="outline" size="sm" className="ml-auto gap-1">
                    <a href={s.applyUrl ?? "#"}>
                      {t("applyOnline")} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </DataState>
    </div>
  );
}