"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sprout, FlaskConical, Droplets, Bug, Handshake, TrendingUp, MessageCircleQuestion } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const seasonMap = { kharif: "KHARIF", rabi: "RABI", zaid: "ZAID" } as const;

export function CropAdvisorView() {
  const t = useTranslations("cropAdvisor");
  const [season, setSeason] = useState<keyof typeof seasonMap>("kharif");
  const [ph, setPh] = useState("6.4");
  const [health, setHealth] = useState(82);
  const [pestRisk, setPestRisk] = useState<"low" | "medium" | "high">("medium");

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <Tabs value={season} onValueChange={(v) => setSeason(v as keyof typeof seasonMap)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kharif">{t("kharif")}</TabsTrigger>
          <TabsTrigger value="rabi">{t("rabi")}</TabsTrigger>
          <TabsTrigger value="zaid">{t("zaid")}</TabsTrigger>
        </TabsList>

        <TabsContent value="kharif" className="mt-4">
          <SeasonBody season="kharif" />
        </TabsContent>
        <TabsContent value="rabi" className="mt-4">
          <SeasonBody season="rabi" />
        </TabsContent>
        <TabsContent value="zaid" className="mt-4">
          <SeasonBody season="zaid" />
        </TabsContent>
      </Tabs>
    </div>
  );

  function SeasonBody({ season: s }: { season: keyof typeof seasonMap }) {
    const soilLabel = t("soil");
    return (
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sprout className="h-4 w-4 text-primary" /> {soilLabel}
            </CardTitle>
            <CardDescription>
              {seasonMap[s]} · {t("phLevel")}: {ph}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ph">{t("phLevel")}</Label>
              <Input id="ph" type="text" inputMode="decimal" value={ph} onChange={(e) => setPh(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sow">{t("sowDate")}</Label>
              <Input id="sow" type="date" defaultValue="2026-06-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="harvest">{t("harvestDate")}</Label>
              <Input id="harvest" type="date" defaultValue="2026-10-15" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <GaugeCard
            icon={<Sprout className="h-4 w-4 text-success" />}
            label={t("cropHealth")}
            value={health}
            tone="text-success"
            onChange={setHealth}
          />
          <PestRiskCard value={pestRisk} onChange={setPestRisk} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <AdviceCard icon={<FlaskConical className="h-4 w-4" />} label={t("fertilizer")} tone="text-primary" text="NPK 20:10:10, 2 bags/acre. Apply after first irrigation." />
          <AdviceCard icon={<Droplets className="h-4 w-4" />} label={t("irrigation")} tone="text-primary" text="3 irrigations planned. Watch for light rain alerts." />
          <AdviceCard icon={<Handshake className="h-4 w-4" />} label={t("companion")} tone="text-primary" text="Grow marigold borders to keep pests away naturally." />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" /> {t("marketPrice")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between rounded-xl bg-muted/40 px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">Soybean · Nashik</p>
                <p className="text-2xl font-bold">₹5,120 <span className="text-sm font-normal text-muted-foreground">/ quintal</span></p>
              </div>
              <Badge variant="soft">+2.1%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("title")} · Week-by-week</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["week1", "week2", "week3", "week4"].map((w, i) => (
              <div key={w} className="rounded-xl border p-3">
                <p className="text-xs font-semibold text-primary">{t(w)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Stage {i + 1} · irrigate at 60% moisture</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button className="w-full gap-2 sm:w-auto">
          <MessageCircleQuestion className="h-4 w-4" /> {t("askExpert")}
        </Button>
      </div>
    );
  }
}

function GaugeCard({
  icon,
  label,
  value,
  tone,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: string;
  onChange: (v: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2 text-base", tone)}>
          {icon} {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold">{value}%</span>
          <div className="flex gap-1">
            {[60, 70, 80, 90].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                  value === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <Progress value={value} className="h-2" />
      </CardContent>
    </Card>
  );
}

function PestRiskCard({
  value,
  onChange,
}: {
  value: "low" | "medium" | "high";
  onChange: (v: "low" | "medium" | "high") => void;
}) {
  const t = useTranslations("cropAdvisor");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bug className="h-4 w-4 text-warning" /> {t("pestRisk")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
        {(["low", "medium", "high"] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
              value === level
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:border-primary/40",
            )}
          >
            {t(level)}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function AdviceCard({ icon, label, text, tone }: { icon: React.ReactNode; label: string; text: string; tone: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className={cn("flex items-center gap-2 text-sm", tone)}>
          {icon} {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}