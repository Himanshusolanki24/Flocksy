"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pill, Plus, Clock, Ban, History } from "lucide-react";
import { useMedicines } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Medicine } from "@/types";

function AddMedicineDialog() {
  const t = useTranslations("medicine");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSaved(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t("addMedicine")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addMedicine")}</DialogTitle>
        </DialogHeader>
        {saved ? (
          <div className="grid place-items-center py-6"><Badge variant="soft">✓ {t("saved")}</Badge></div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
            <div className="space-y-1.5">
              <Label htmlFor="mname">{t("medicineName")}</Label>
              <Input id="mname" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="batch">{t("batchNo")}</Label>
                <Input id="batch" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cost">{t("cost")}</Label>
                <Input id="cost" type="number" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dose">{t("dose")}</Label>
              <Input id="dose" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="schedule">{t("schedule")}</Label>
              <Input id="schedule" />
            </div>
            <Button type="submit" className="w-full">{t("add")}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MedicineCard({ med }: { med: Medicine }) {
  const t = useTranslations("medicine");
  const active = med.course === "active";
  const nextDue = med.nextDoseAt ? new Date(med.nextDoseAt) : null;
  const dueSoon = active && nextDue && nextDue.getTime() - Date.now() < 12 * 36e5;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Pill className="h-5 w-5 text-primary" />
          </span>
          <div>
            <p className="text-sm font-semibold">{med.name}</p>
            <p className="text-xs text-muted-foreground">{t("batchNo")}: {med.batchNo ?? "—"}</p>
          </div>
        </div>
        <Badge variant={active ? "soft" : "secondary"} className={cn(active && "text-success")}>
          {t(active ? "activeCourses" : "history")}
        </Badge>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <Row label={t("dose")} value={med.dose} />
        <Row label={t("schedule")} value={med.schedule} />
        <Row label={t("stock")} value={med.stock} />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("cost")}</span>
          <span className="font-semibold">{formatINR(med.cost)}</span>
        </div>
      </div>

      {active && nextDue ? (
        <div className={cn("mt-4 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium", dueSoon ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
          <Clock className="h-3.5 w-3.5" />
          {t("doseDue")}: {nextDue.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {med.withdrawalDays > 0 ? ` · ${t("withdrawal")}: ${med.withdrawalDays}d` : null}
        </div>
      ) : med.withdrawalDays > 0 ? (
        <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
          <Ban className="h-3.5 w-3.5" /> {t("withdrawal")}: {med.withdrawalDays}d
        </div>
      ) : null}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function MedicineView() {
  const t = useTranslations("medicine");
  const { data, isLoading, isError, refetch } = useMedicines();
  const meds = data ?? [];
  const active = meds.filter((m) => m.course === "active");

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} actions={<AddMedicineDialog />} />

      <Tabs defaultValue="activeCourses">
        <TabsList>
          <TabsTrigger value="activeCourses">{t("activeCourses")} ({active.length})</TabsTrigger>
          <TabsTrigger value="history">{t("history")}</TabsTrigger>
        </TabsList>
        <TabsContent value="activeCourses" className="mt-4">
          <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
            {active.length === 0 ? (
              <Card><CardContent className="grid place-items-center gap-2 py-12"><History className="h-8 w-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">{t("noMedicines")}</p></CardContent></Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((m) => <MedicineCard key={m.id} med={m} />)}
              </div>
            )}
          </DataState>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meds.filter((m) => m.course === "completed").map((m) => <MedicineCard key={m.id} med={m} />)}
            </div>
          </DataState>
        </TabsContent>
      </Tabs>
    </div>
  );
}