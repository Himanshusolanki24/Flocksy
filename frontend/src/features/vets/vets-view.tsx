"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Phone,
  MessageCircle,
  Video,
  CalendarPlus,
  MapPin,
  Star,
  Search,
  BriefcaseBusiness,
  Languages,
} from "lucide-react";
import { useVets } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Vet } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function BookDialog({ vet }: { vet: Vet }) {
  const t = useTranslations("vets");
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setBooked(false);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-10 gap-1.5">
          <CalendarPlus className="h-4 w-4" aria-hidden /> {t("book")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("consultationTitle")}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {vet.name} · {vet.specialty}
          </p>
        </DialogHeader>
        {booked ? (
          <div className="grid place-items-center gap-2 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CalendarPlus className="h-6 w-6" aria-hidden />
            </span>
            <p className="font-semibold">{t("booked")}</p>
            <p className="text-sm text-muted-foreground">{vet.availability}</p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setBooked(true);
              toast.success(t("booked"), { description: vet.name });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="date">{t("selectDate")}</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">{t("selectTime")}</Label>
              <select
                id="time"
                className="h-10 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {["09:00", "11:00", "14:00", "16:00", "18:00"].map((tm) => (
                  <option key={tm}>{tm}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Input id="notes" placeholder="…" />
            </div>
            <Button type="submit" className="h-11 w-full">
              {t("confirmBooking")}
            </Button>
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
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const q = query.trim().toLowerCase();
  const vets = (data ?? []).filter((v) => {
    const matchesTab = tab === "all" || v.online;
    const matchesQuery =
      !q ||
      [v.name, v.city, v.specialty].some((field) =>
        field.toLowerCase().includes(q),
      );
    return matchesTab && matchesQuery;
  });
  const online = (data ?? []).filter((v) => v.online).length;

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Badge variant="soft" className="gap-1.5 px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-success" aria-hidden />{" "}
            {online} {t("online")}
          </Badge>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="h-11 pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">{t("allVets")}</TabsTrigger>
            <TabsTrigger value="online">{t("onlineOnly")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DataState
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      >
        {vets.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {t("noVets")}
          </p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {vets.map((vet) => (
              <VetCard
                key={vet.id}
                vet={vet}
                saved={saved.has(vet.id)}
                onToggleSave={() => toggleSave(vet.id)}
              />
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}

function VetCard({
  vet,
  saved,
  onToggleSave,
}: {
  vet: Vet;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const t = useTranslations("vets");
  const soon = () => toast(t("featureSoon", { name: vet.name }));

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
              {initials(vet.name)}
            </AvatarFallback>
          </Avatar>
          {vet.online ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card bg-success"
              aria-hidden
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold">{vet.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {vet.specialty}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={saved}
              aria-label={t("saveVet")}
              className="-m-2 shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:text-warning"
            >
              <Star
                className={cn("h-5 w-5", saved && "fill-warning text-warning")}
                aria-hidden
              />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> {vet.city}
            </span>
            <span className="flex items-center gap-1">
              <Star
                className="h-3.5 w-3.5 fill-warning text-warning"
                aria-hidden
              />{" "}
              {vet.rating}
            </span>
            <span className="flex items-center gap-1">
              <BriefcaseBusiness className="h-3.5 w-3.5" aria-hidden />{" "}
              {vet.experience}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge
              variant={vet.online ? "soft" : "outline"}
              className="text-[11px]"
            >
              {vet.availability}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Languages className="h-3.5 w-3.5" aria-hidden />{" "}
              {(vet.languages ?? []).join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5"
          onClick={soon}
        >
          <Phone className="h-4 w-4" aria-hidden /> {t("call")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5"
          onClick={soon}
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> {t("chat")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5"
          onClick={soon}
        >
          <Video className="h-4 w-4" aria-hidden /> {t("video")}
        </Button>
        <BookDialog vet={vet} />
      </div>
    </Card>
  );
}
