"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, PackageCheck, Timer, AlertTriangle, Droplets, ShieldCheck, Scale } from "lucide-react";
import { useFeedBatches } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { FeedBatch } from "@/types";

function daysLeftTone(days: number) {
  if (days <= 5) return "text-destructive";
  if (days <= 10) return "text-warning";
  return "text-success";
}

function AddBatchDialog() {
  const t = useTranslations("feed");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSaved(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t("addBatch")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addBatch")}</DialogTitle>
        </DialogHeader>
        {saved ? (
          <div className="grid place-items-center py-6"><Badge variant="soft">✓ {t("saved")}</Badge></div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
            <div className="space-y-1.5">
              <Label htmlFor="brand">{t("brand")}</Label>
              <Input id="brand" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t("type")}</Label>
                <select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                  {["starter", "grower", "finisher", "layer", "dairy"].map((ty) => (
                    <option key={ty} value={ty}>{t(ty)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">{t("weight")}</Label>
                <Input id="weight" type="number" defaultValue={500} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cost">{t("cost")}</Label>
                <Input id="cost" type="number" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiry">{t("expiryDate")}</Label>
                <Input id="expiry" type="date" />
              </div>
            </div>
            <Button type="submit" className="w-full">{t("add")}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BatchCard({ batch }: { batch: FeedBatch }) {
  const t = useTranslations("feed");
  const tone = daysLeftTone(batch.daysLeft);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{batch.brand}</p>
          <Badge variant="outline" className="mt-1">{t(batch.type)}</Badge>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{batch.weightKg} <span className="text-xs font-normal text-muted-foreground">kg</span></p>
          <p className="text-xs text-muted-foreground">{formatINR(batch.cost)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" /> {t("qualityScore")}
          </span>
          <span className="font-semibold">{batch.qualityScore}/100</span>
        </div>
        <Progress value={batch.qualityScore} className="h-1.5" />
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Droplets className="h-4 w-4 text-primary" /> {t("avgDailyConsumption")}
          </span>
          <span className="font-semibold">{batch.avgDailyConsumptionKg} kg</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={cn("flex items-center gap-1.5", tone)}>
            <Timer className="h-4 w-4" /> {t("daysLeft")}
          </span>
          <span className={cn("font-semibold", tone)}>{batch.daysLeft}d</span>
        </div>
      </div>

      {batch.daysLeft <= 6 ? (
        <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 text-warning">
          <AlertTriangle className="h-4 w-4" /> {t("reorder")}
        </Button>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <MiniStat label={t("protein")} value="22%" />
          <MiniStat label={t("moisture")} value="12%" />
        </div>
      )}
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

export function FeedView() {
  const t = useTranslations("feed");
  const { data, isLoading, isError, refetch } = useFeedBatches();
  const batches = data ?? [];

  const totalKg = batches.reduce((s, b) => s + b.weightKg, 0);
  const avgQuality = batches.length ? Math.round(batches.reduce((s, b) => s + b.qualityScore, 0) / batches.length) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} actions={<AddBatchDialog />} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryTile icon={<PackageCheck className="h-5 w-5 text-primary" />} label={t("weight")} value={`${totalKg} kg`} />
        <SummaryTile icon={<Scale className="h-5 w-5 text-primary" />} label={t("type")} value={String(batches.length)} />
        <SummaryTile icon={<ShieldCheck className="h-5 w-5 text-success" />} label={t("qualityScore")} value={`${avgQuality}/100`} />
        <SummaryTile icon={<Timer className="h-5 w-5 text-warning" />} label={t("daysLeft")} value={Math.min(...batches.map((b) => b.daysLeft), 99) + "d"} />
      </div>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => <BatchCard key={b.id} batch={b} />)}
        </div>
      </DataState>
    </div>
  );
}

function SummaryTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">{icon}</span>
      <p className="mt-3 text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}