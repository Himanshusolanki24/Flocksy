"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, TrendingUp, TrendingDown, Egg, Milk, Beef, IndianRupee } from "lucide-react";
import { useFinance } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/shared/stat-card";
import { AreaTrend, BarSeries, LineSeries } from "@/components/charts";
import { formatINR } from "@/lib/utils";

export function AnalyticsView() {
  const t = useTranslations("analytics");
    const { data: finance } = useFinance();
  const [range, setRange] = useState("last7Days");

  const trend = (finance?.monthlyTrend ?? []).map((p) => ({ label: p.day, value: p.value }));
  const costTrend = trend.map((p) => ({ label: p.label, value: 30 + ((p.value * 7) % 60) }));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> {t("download")}
          </Button>
        }
      />

      <Tabs value={range} onValueChange={setRange}>
        <TabsList>
          <TabsTrigger value="last7Days">{t("last7Days")}</TabsTrigger>
          <TabsTrigger value="last30Days">{t("last30Days")}</TabsTrigger>
          <TabsTrigger value="thisMonth">{t("thisMonth")}</TabsTrigger>
          <TabsTrigger value="lastYear">{t("lastYear")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t("production")}
          value="12,480"
          icon={Egg}
          trend="up"
          trendLabel="+4.2%"
        />
        <StatCard
          label={t("mortality")}
          value="1.8%"
          icon={TrendingDown}
          trend="down"
          trendLabel="−0.3%"
        />
        <StatCard
          label={t("feedCost")}
          value={formatINR(84700)}
          icon={TrendingUp}
          trend="up"
          trendLabel="+2.1%"
        />
        <StatCard
          label={t("profitMargin")}
          value="31%"
          icon={IndianRupee}
          trend="up"
          trendLabel="+5.0%"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("revenue")}</CardTitle>
            <CardDescription>{t("eggProduction")}</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaTrend data={trend} height={240} color="var(--chart-1)" prefix="₹" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("expenses")}</CardTitle>
            <CardDescription>{t("feedCost")}</CardDescription>
          </CardHeader>
          <CardContent>
            <BarSeries data={costTrend} height={240} color="var(--chart-2)" prefix="₹" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Egg className="h-4 w-4 text-primary" /> {t("eggProduction")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">320/day</p>
            <p className="text-xs text-muted-foreground">85% laying rate</p>
            <LineSeries data={trend.slice(0, 7)} height={120} color="var(--chart-1)" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Milk className="h-4 w-4 text-primary" /> {t("milkProduction")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">46 L/day</p>
            <p className="text-xs text-muted-foreground">3 cows · 15.3 L avg</p>
            <LineSeries data={trend.slice(0, 7)} height={120} color="var(--chart-3)" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Beef className="h-4 w-4 text-primary" /> {t("weightGain")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1.9 kg</p>
            <p className="text-xs text-muted-foreground">broiler ADG</p>
            <LineSeries data={trend.slice(0, 7)} height={120} color="var(--chart-4)" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-base">{t("insights")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InsightLine text={t("insight1")} />
          <InsightLine text={t("insight2")} />
        </CardContent>
      </Card>
    </div>
  );
}

function InsightLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 px-4 py-3 text-sm">
      <Badge variant="soft" className="mt-0.5 shrink-0">💡</Badge>
      <span>{text}</span>
    </div>
  );
}