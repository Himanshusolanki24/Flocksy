"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, MessageCircle, Video, CalendarPlus, MapPin, Star } from "lucide-react";
import { useVets } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function BookDialog({ vetName, specialty }: { vetName: string; specialty: string }) {
  const t = useTranslations("vets");
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setBooked(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5"><CalendarPlus className="h-4 w-4" /> {t("book")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("consultationTitle")} — {vetName}</DialogTitle>
          <p className="text-sm text-muted-foreground">{specialty}</p>
        </DialogHeader>
        {booked ? (
          <div className="grid place-items-center py-6 text-center">
            <Badge variant="soft" className="mb-2">✓ {t("booked")}</Badge>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setBooked(true); }}>
            <div className="space-y-1.5">
              <Label htmlFor="date">{t("selectDate")}</Label>
              <Input id="date" type="date" defaultValue="2026-08-07" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">{t("selectTime")}</Label>
              <select id="time" className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                {["09:00", "11:00", "14:00", "16:00", "18:00"].map((tm) => <option key={tm}>{tm}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Input id="notes" placeholder="Symptoms to share…" />
            </div>
            <Button type="submit" className="w-full">{t("confirmBooking")}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function VetsView() {
  const t = useTranslations("vets");
  const { data, isLoading, isError, refetch } = useVets();
  const [tab, setTab] = useState("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const vets = (data ?? []).filter((v) => tab === "all" || v.specialty.toLowerCase().includes(tab));
  const online = (data ?? []).filter((v) => v.online).length;

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
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={<Badge variant="soft" className="gap-1"><span className="h-2 w-2 rounded-full bg-success" /> {online} {t("online")}</Badge>}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">{t("nearbyVets")}</TabsTrigger>
          <TabsTrigger value="poultry">{t("filterSpecialty")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {vets.map((vet) => (
            <Card key={vet.id} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/15 text-primary">{initials(vet.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{vet.name}</p>
                    {vet.online ? <span className="h-2 w-2 shrink-0 rounded-full bg-success" /> : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{vet.specialty}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {vet.city}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" /> {vet.rating}</span>
                    <Badge variant="outline" className="text-[10px]">{vet.availability}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className={cn("shrink-0", saved.has(vet.id) && "text-primary")} onClick={() => toggleSave(vet.id)}>
                  {saved.has(vet.id) ? "★" : "☆"}
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button variant="outline" size="sm" className="gap-1"><Phone className="h-3.5 w-3.5" /> {t("call")}</Button>
                <Button variant="outline" size="sm" className="gap-1"><MessageCircle className="h-3.5 w-3.5" /> {t("chat")}</Button>
                <Button variant="outline" size="sm" className="gap-1"><Video className="h-3.5 w-3.5" /> {t("video")}</Button>
                <BookDialog vetName={vet.name} specialty={vet.specialty} />
              </div>
            </Card>
          ))}
        </div>
      </DataState>
    </div>
  );
}