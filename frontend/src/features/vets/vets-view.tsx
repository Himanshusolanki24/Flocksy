"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Stethoscope,
  Phone,
  MessageCircle,
  Video,
  CalendarPlus,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Search,
  Bot,
  Building2,
  Award,
  FileText,
} from "lucide-react";
import { useVets } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Vet } from "@/types";

function initials(name: string) {
  return name
    .replace("Dr. ", "")
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
  const [consultType, setConsultType] = useState<"video" | "phone" | "visit">("video");
  const [selectedFlock, setSelectedFlock] = useState("Coop 1 (Broilers · 800 birds)");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");

  const resetForm = () => {
    setBooked(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full gap-1.5 bg-[#225424] text-white hover:bg-[#183e1a] sm:w-auto">
          <CalendarPlus className="h-4 w-4" /> {t("consultNow")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF3EA] text-[#225424]">
              <Stethoscope className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-lg font-semibold text-[#1E2922]">
                {t("consultationTitle")} — {vet.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {vet.specialty} · {vet.city}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {booked ? (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3EA] text-[#225424]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E2922]">{t("booked")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your consultation with {vet.name} is confirmed for {selectedTime}.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-[#F8FAF6] p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor:</span>
                <span className="font-medium text-[#1E2922]">{vet.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-medium text-[#1E2922] capitalize">{consultType} Call</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flock Shed:</span>
                <span className="font-medium text-[#1E2922]">{selectedFlock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flock Health Sync:</span>
                <span className="font-medium text-emerald-700">✓ Shared with Dr.</span>
              </div>
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="w-full bg-[#225424] text-white hover:bg-[#183e1a]"
            >
              Done
            </Button>
          </div>
        ) : (
          <form
            className="space-y-4 pt-1"
            onSubmit={(e) => {
              e.preventDefault();
              setBooked(true);
            }}
          >
            {/* Consult Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1E2922]">Consultation Mode</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "video", label: "Video Call", icon: Video },
                  { id: "phone", label: "Phone Call", icon: Phone },
                  { id: "visit", label: "Shed Visit", icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = consultType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setConsultType(item.id as any)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs font-medium transition-colors",
                        active
                          ? "border-[#225424] bg-[#EAF3EA] text-[#225424] font-semibold"
                          : "border-border/80 bg-card hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flock Shed Select */}
            <div className="space-y-1.5">
              <Label htmlFor="flock-select" className="text-xs font-semibold text-[#1E2922]">
                Affected Shed / Flock
              </Label>
              <select
                id="flock-select"
                value={selectedFlock}
                onChange={(e) => setSelectedFlock(e.target.value)}
                className="h-9 w-full rounded-md border border-border/80 bg-background px-3 text-xs"
              >
                <option>Coop 1 (Broilers · 800 birds · Day 21)</option>
                <option>Coop 2 (Broilers · 800 birds · Day 21)</option>
                <option>Coop 3 (Broilers · 800 birds · At Risk)</option>
                <option>Layer Farm (Layers · 250 birds · Day 120)</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-semibold text-[#1E2922]">
                  {t("selectDate")}
                </Label>
                <Input
                  id="date"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-xs font-semibold text-[#1E2922]">
                  {t("selectTime")}
                </Label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="h-9 w-full rounded-md border border-border/80 bg-background px-3 text-xs"
                >
                  <option>09:30 AM</option>
                  <option>11:00 AM</option>
                  <option>02:30 PM</option>
                  <option>04:00 PM</option>
                  <option>06:00 PM</option>
                </select>
              </div>
            </div>

            {/* Symptoms notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold text-[#1E2922]">
                {t("notes")}
              </Label>
              <Input
                id="notes"
                placeholder="e.g. Droopy comb, reduced feed intake in Coop 3, loose droppings..."
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="rounded-lg bg-[#EAF3EA]/50 p-2.5 text-[11px] text-[#225424] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Flocksy will automatically attach recent mortality rates and temperature logs for the vet.</span>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#225424] text-white hover:bg-[#183e1a]"
            >
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
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const vets = (data ?? []).filter((v) => {
    const matchesTab =
      tab === "all" ||
      (tab === "pathology" && (v.specialty.toLowerCase().includes("pathology") || v.specialty.toLowerCase().includes("disease"))) ||
      (tab === "broiler" && v.specialty.toLowerCase().includes("broiler")) ||
      (tab === "layer" && v.specialty.toLowerCase().includes("layer")) ||
      (tab === "biosecurity" && v.specialty.toLowerCase().includes("biosecurity"));

    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase()) ||
      v.specialty.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const onlineCount = (data ?? []).filter((v) => v.online).length;

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-14 pt-2 sm:px-6">
      {/* 1. Hero Header Section */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-soft">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5E5D5] bg-[#EAF3EA] px-3.5 py-1 text-xs font-semibold text-[#225424]">
            <span className="h-2 w-2 rounded-full bg-[#225424] animate-pulse" />
            {t("heroEyebrow")}
          </div>

          <div className="mt-4 flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF3EA] to-[#D5E9D5] text-[#225424] shadow-xs border border-[#CDE3CD]/80 ring-2 ring-white">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1E2922] sm:text-4xl">
              {t("heroTitle")}
            </h1>
          </div>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("heroSubtitle")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="bg-[#225424] text-white hover:bg-[#183e1a] shadow-sm font-medium"
            >
              <a href="#vets-directory">
                {t("heroCtaFind")} <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-border/80 bg-white text-[#1E2922] hover:bg-muted/50"
            >
              <Link href="/assistant">
                <Bot className="mr-1.5 h-4 w-4 text-[#225424]" />
                {t("askFlocksy")}
              </Link>
            </Button>

            <div className="ml-auto hidden items-center gap-4 text-xs font-medium text-muted-foreground lg:flex">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {onlineCount > 0 ? onlineCount : (data?.length ?? 3)} {t("availableNow")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#225424]" />
                Avg. response &lt; 15 mins
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                4.9/5 Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI First Banner ("AI first. Expert when it matters.") */}
      <section className="rounded-xl border border-[#D5E5D5] bg-[#EAF3EA]/70 p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#225424] shadow-xs">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#1E2922]">{t("aiVetTitle")}</h2>
              <p className="mt-0.5 text-xs leading-relaxed text-[#2D4A35]">
                {t("aiVetText")}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-[#225424] text-white hover:bg-[#183e1a] text-xs font-medium"
            >
              <Link href="/diagnosis">
                {t("runHealthCheck")}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-[#225424]/30 bg-white text-[#225424] hover:bg-white/80 text-xs font-medium"
            >
              <a href="#vets-directory">
                {t("talkToVet")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Directory Controls: Search & Category Tabs */}
      <div id="vets-directory" className="space-y-4 pt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1E2922]">{t("nearbyVets")}</h2>
            <p className="text-xs text-muted-foreground">
              Consult top verified avian pathologists and commercial poultry specialists.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vet name, city or specialty..."
              className="h-9 pl-9 text-xs border-border/80 bg-white"
            />
          </div>
        </div>

        {/* Specialty Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Specialists" },
            { id: "pathology", label: "Avian Pathology & Disease" },
            { id: "broiler", label: "Broiler Health & FCR" },
            { id: "layer", label: "Layer & Egg Yield" },
            { id: "biosecurity", label: "Biosecurity & Shed Climate" },
          ].map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  active
                    ? "border-[#225424] bg-[#EAF3EA] text-[#225424] font-semibold ring-1 ring-[#225424]"
                    : "border-border/80 bg-white text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Veterinarians Cards Grid */}
      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vets.map((vet) => {
            const isSaved = saved.has(vet.id);
            return (
              <Card
                key={vet.id}
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-white p-5 shadow-soft transition-all hover:border-[#225424]/40 hover:shadow-md"
              >
                <div>
                  {/* Top Doctor Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 rounded-xl border border-border/70">
                        <AvatarFallback className="rounded-xl bg-[#EAF3EA] text-base font-bold text-[#225424]">
                          {initials(vet.name)}
                        </AvatarFallback>
                      </Avatar>
                      {vet.online && (
                        <span
                          title="Online now"
                          className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="soft"
                        className="gap-1 border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-800"
                      >
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        {t("verified")}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => toggleSave(vet.id)}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md border border-border/80 text-xs transition-colors hover:bg-muted/40 cursor-pointer",
                          isSaved ? "text-amber-500 border-amber-300 bg-amber-50" : "text-muted-foreground"
                        )}
                      >
                        {isSaved ? "★" : "☆"}
                      </button>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="mt-3.5">
                    <h3 className="text-base font-bold text-[#1E2922]">{vet.name}</h3>
                    <p className="text-xs font-medium text-[#225424]">
                      {t("poultryVet")} · {vet.experience ? `${vet.experience} exp.` : "10+ yrs exp."}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {vet.specialty}
                    </p>
                  </div>

                  {/* Meta Pills: City & Rating & Languages */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 rounded-md bg-muted/40 px-2 py-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground" /> {vet.city}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-amber-900 font-medium">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {vet.rating ?? 4.8}
                    </span>
                    {vet.languages && (
                      <span className="text-[11px] text-muted-foreground">
                        🗣️ {vet.languages.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>

                  {/* Availability indicator */}
                  <div className="mt-3.5 flex items-center gap-1.5 text-xs">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        vet.online ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                      )}
                    />
                    <span className="font-medium text-[#1E2922]">
                      {vet.online ? t("availableNow") : vet.availability}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-5 border-t border-border/60 pt-3.5">
                  <div className="flex items-center gap-2">
                    <BookDialog vet={vet} />

                    <Button
                      variant="outline"
                      size="sm"
                      title="Direct Phone Consultation"
                      className="border-border/80 bg-white text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer"
                      onClick={() => alert(`Calling ${vet.name} via Flocksy Vet Helpline...`)}
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      title="Chat with Vet"
                      className="border-border/80 bg-white text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer"
                      asChild
                    >
                      <Link href="/assistant">
                        <MessageCircle className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </DataState>

      {/* 5. "Why consult through Flocksy?" Section */}
      <section className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-soft">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-[#1E2922]">{t("whyFlocksy")}</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Designed specifically for Indian poultry farmers to eliminate misdiagnosis and prevent entire flock losses.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: t("benefitVerified"),
              desc: "Every veterinarian is licensed with the Veterinary Council of India (VCI) and verified.",
              icon: ShieldCheck,
            },
            {
              title: t("benefitPoultry"),
              desc: "Specialists in broiler FCR, layer egg yield, biosecurity, and avian epidemic control.",
              icon: Award,
            },
            {
              title: t("benefitHistory"),
              desc: "Vets can view your shed temperature logs, flock size, age, and mortality stats instantly.",
              icon: FileText,
            },
            {
              title: t("benefitGuidance"),
              desc: "Actionable dosage schedules with strict drug withdrawal period alerts for safe eggs & meat.",
              icon: CheckCircle2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-[#F8FAF6] p-4 transition-colors hover:border-[#225424]/30"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3EA] text-[#225424]">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-[#1E2922]">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. "How it works" 5-Step Flow */}
      <section className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-soft">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-[#1E2922]">{t("flowTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            From first symptom to recovery — 5 transparent steps to protect your flock.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { step: "1", title: t("flowStep1"), desc: "Select shed & describe symptoms or post photo" },
            { step: "2", title: t("flowStep2"), desc: "Flocksy syncs bird age, mortality & heat logs" },
            { step: "3", title: t("flowStep3"), desc: "Avian doctor reviews case within minutes" },
            { step: "4", title: t("flowStep4"), desc: "Prescription, electrolyte plan & litter care" },
            { step: "5", title: t("flowStep5"), desc: "Automatic 24h health check to verify recovery" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-xl border border-border/70 bg-[#F8FAF6] p-4"
            >
              <div>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#225424] text-xs font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-2.5 text-xs font-bold text-[#1E2922]">{item.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
