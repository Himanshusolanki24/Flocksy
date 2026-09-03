"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Syringe, Plus, CalendarClock, CheckCircle2, AlertCircle } from "lucide-react";
import { useVaccinations } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { VaccinationStatus } from "@/types";

const statusStyle: Record<VaccinationStatus, { label: string; cls: string }> = {
  completed: { label: "done", cls: "text-success" },
  scheduled: { label: "scheduled", cls: "text-primary" },
  overdue: { label: "overdue", cls: "text-destructive" },
};

export function VaccinationView() {
  const t = useTranslations("vaccination");
  const { data, isLoading, isError, refetch } = useVaccinations();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const all = data ?? [];

  const upcoming = all.filter((v) => v.status !== "completed").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const done = all.filter((v) => v.status === "completed");

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
      <PageHeader
        icon={<Syringe className="h-6 w-6" />}
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <Badge variant="soft" className="gap-1 text-success"><CheckCircle2 className="h-3 w-3" /> {t("completed")}: {done.length}</Badge>
        <Badge variant="soft" className="gap-1"><CalendarClock className="h-3 w-3" /> {t("scheduled")}: {upcoming.filter((v) => v.status === "scheduled").length}</Badge>
        <Badge variant="soft" className="gap-1 text-destructive"><AlertCircle className="h-3 w-3" /> {t("overdue")}: {upcoming.filter((v) => v.status === "overdue").length}</Badge>
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSaved(false); }}>
        <DialogTrigger asChild>
          <Button className="gap-2"><Plus className="h-4 w-4" /> {t("addVaccination")}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{t("scheduleTitle")}</DialogTitle></DialogHeader>
          {saved ? (
            <div className="grid place-items-center py-6"><Badge variant="soft">✓ {t("saved")}</Badge></div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
              <div className="space-y-1.5">
                <Label htmlFor="vaccine">{t("vaccine")}</Label>
                <Input id="vaccine" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="flock">{t("flock")}</Label>
                  <Input id="flock" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="age">{t("age")}</Label>
                  <Input id="age" type="number" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">{t("date")}</Label>
                <Input id="date" type="date" />
              </div>
              <Button type="submit" className="w-full">{t("saved")}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="mt-5 space-y-3">
          {upcoming.map((v) => {
            const s = statusStyle[v.status];
            const due = new Date(v.dueDate);
            return (
              <Card key={v.id} className="p-4">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", v.status === "overdue" ? "bg-destructive/10" : v.status === "scheduled" ? "bg-primary/10" : "bg-success/10")}>
                    <Syringe className={cn("h-5 w-5", v.status === "overdue" ? "text-destructive" : v.status === "scheduled" ? "text-primary" : "text-success")} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{v.vaccine}</p>
                    <p className="text-xs text-muted-foreground">{v.flock} · {t("age")}: {v.ageDays}d</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="soft" className={s.cls}>{t(s.label)}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{due.toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {done.length > 0 ? (
          <Card className="mt-5">
            <CardHeader><CardTitle className="text-base">{t("done")}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {done.map((v) => (
                <div key={v.id} className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="flex-1">{v.vaccine}</span>
                  <span className="text-muted-foreground">{new Date(v.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </DataState>
    </div>
  );
}