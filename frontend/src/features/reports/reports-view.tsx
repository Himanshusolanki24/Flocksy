"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Download, Share2, Printer, Activity, Skull, HeartPulse, CheckCircle2 } from "lucide-react";
import { useDashboard } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ReportType = "healthReport" | "productionReport" | "financialReport";

export function ReportsView() {
  const t = useTranslations("reports");
  const { data: dash } = useDashboard();
  const [type, setType] = useState<ReportType>("healthReport");
  const [generated, setGenerated] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" /> {t("reportType")}
          </CardTitle>
          <CardDescription>{t("period")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={type} onValueChange={(v) => { setType(v as ReportType); setGenerated(false); }}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="healthReport">{t("healthReport")}</TabsTrigger>
              <TabsTrigger value="productionReport">{t("productionReport")}</TabsTrigger>
              <TabsTrigger value="financialReport">{t("financialReport")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t("period")}</label>
              <select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Format</label>
              <select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                <option>PDF</option>
                <option>Excel</option>
              </select>
            </div>
          </div>

          <Button className="w-full gap-2" onClick={() => setGenerated(true)}>
            {generated ? <CheckCircle2 className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
            {t("generate")}
          </Button>
        </CardContent>
      </Card>

      {generated ? (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartPulse className="h-4 w-4 text-success" /> {t("healthReport")}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="soft">✓ {t("generated")}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-4">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><HeartPulse className="h-4 w-4 text-success" /> {t("healthScore")}</p>
                <p className="mt-1 text-2xl font-bold">{dash?.healthyBirdRatio ?? 92}%</p>
                <Progress value={dash?.healthyBirdRatio ?? 92} className="mt-2 h-1.5" />
              </div>
              <div className="rounded-xl border p-4">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Skull className="h-4 w-4 text-destructive" /> {t("mortalityRate")}</p>
                <p className="mt-1 text-2xl font-bold">1.8%</p>
                <Progress value={1.8} max={5} className="mt-2 h-1.5" />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <ReportLine label={t("healthReport")} value="All flocks stable" />
              <ReportLine label={t("mortalityRate")} value="Within normal range (−0.3%)" />
              <ReportLine label={t("productionReport")} value="Laying rate 85% (target 80%)" />
              <ReportLine label={t("financialReport")} value="Net margin +31% this period" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> {t("download")}</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="h-4 w-4" /> {t("share")}</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><Printer className="h-4 w-4" /> {t("print")}</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function ReportLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium")}>{value}</span>
    </div>
  );
}