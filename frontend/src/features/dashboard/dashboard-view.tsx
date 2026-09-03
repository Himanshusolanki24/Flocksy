"use client";

import {
  AlertTriangle,
  HeartPulse,
  Lightbulb,
  SunMedium,
  Users,
  Bug,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const flockStats = [
  { label: "Total Birds", value: "2,400", sub: "3 active sheds", icon: Users, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-l-4 border-l-emerald-600" },
  { label: "Healthy", value: "2,194", sub: "91% doing well", icon: HeartPulse, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-l-4 border-l-emerald-600" },
  { label: "At Risk", value: "156", sub: "Watch closely today", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-l-4 border-l-amber-500" },
  { label: "Diseased", value: "50", sub: "Needs treatment", icon: Bug, color: "text-rose-600", bg: "bg-rose-50", border: "border-l-4 border-l-rose-500" },
];

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Page header with Heading Icon & Farm Silhouette Illustration */}
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-transparent sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF3EA] to-[#D5E9D5] text-[#225424] shadow-xs border border-[#CDE3CD]/80 ring-2 ring-white">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#225424]/80">Today on your farm</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2922] sm:text-3xl">Flock Health Dashboard</h1>
          </div>
        </div>

        {/* Decorative farm landscape illustration */}
        <div className="pointer-events-none absolute -right-2 -top-4 hidden h-24 w-80 opacity-80 sm:block lg:h-28 lg:w-96">
          <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            {/* Distant Hills */}
            <path d="M0 100 Q 110 50 220 85 T 400 65 L 400 120 L 0 120 Z" fill="#E2EBE0" />
            <path d="M50 110 Q 180 70 300 95 T 420 80 L 420 120 L 50 120 Z" fill="#D3E2D0" />
            
            {/* Silo */}
            <rect x="310" y="52" width="16" height="42" rx="2" fill="#B9D0B6" />
            <path d="M310 52 C310 44 326 44 326 52 Z" fill="#A8C4A5" />
            
            {/* Barn House */}
            <path d="M330 65 L352 50 L374 65 V94 H330 Z" fill="#C5DCC1" />
            <polygon points="340,94 340,76 364,76 364,94" fill="#EBF3EA" />
            <polygon points="344,94 344,79 360,79 360,94" fill="#A8C4A5" />

            {/* Trees */}
            <circle cx="280" cy="78" r="14" fill="#B0CBB0" />
            <rect x="278" y="86" width="4" height="12" fill="#8FA88F" />
            <circle cx="296" cy="82" r="11" fill="#A2C0A2" />
            <circle cx="385" cy="80" r="13" fill="#B0CBB0" />
            
            {/* Fore-ground hill */}
            <path d="M0 115 Q 160 90 320 110 T 450 105 L 450 120 L 0 120 Z" fill="#C2D8BF" />
          </svg>
        </div>
      </div>

      {/* Stats Cards with Hover Lift and Eye-catching Icons */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {flockStats.map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={cn(
              "group flex items-center justify-between rounded-xl border border-border/80 bg-white p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
              border
            )}
          >
            <div className="flex items-center gap-3.5">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105", bg, color)}>
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-2xl font-extrabold tracking-tight text-[#1E2922]">{value}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-6">
          <HealthOverview />
          <RecentAlerts />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AiRecommendation />
          <WeatherToday />
        </div>
      </div>
    </div>
  );
}

function HealthOverview() {
  return (
    <section className="rounded-xl border border-border/80 bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Flock Health Overview</h2>

      {/* Segmented bar */}
      <div className="flex h-2.5 overflow-hidden rounded-full bg-[#E5EAE2]">
        <span className="h-full rounded-l-full bg-[#2E7D32]" style={{ width: "91%" }} />
        <span className="h-full bg-[#E67E22]" style={{ width: "7%" }} />
        <span className="h-full rounded-r-full bg-[#D32F2F]" style={{ width: "2%" }} />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2E7D32]" />
          <span className="text-xs text-muted-foreground">Healthy</span>
          <span className="text-xs font-semibold text-foreground">91%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E67E22]" />
          <span className="text-xs text-muted-foreground">At Risk</span>
          <span className="text-xs font-semibold text-foreground">7%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D32F2F]" />
          <span className="text-xs text-muted-foreground">Diseased</span>
          <span className="text-xs font-semibold text-foreground">2%</span>
        </div>
      </div>

      {/* Insight hint */}
      <div className="mt-5 rounded-lg border border-border/60 bg-[#F5F8F4] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Best next step — </span>
        Check Coop 3 before noon. Heat and low activity are the main reasons the risk score changed today.
      </div>
    </section>
  );
}

function AiRecommendation() {
  return (
    <section className="rounded-xl border border-[#D5E5D3] bg-[#F2F8F1] p-5 shadow-soft">
      <div className="mb-2.5 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#2E7D32]" />
        <p className="text-xs font-semibold text-[#2E7D32]">AI Recommendation</p>
      </div>
      <p className="text-sm font-semibold text-foreground">Give extra cool water and improve airflow in Coop 3.</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Flocksy noticed warm weather, lower movement and two recent alerts. Recheck birds after 4 hours.
      </p>
    </section>
  );
}

function WeatherToday() {
  return (
    <section className="rounded-xl border border-border/80 bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <SunMedium className="h-4 w-4 text-amber-500" />
        <p className="text-xs font-semibold text-foreground">Weather Today</p>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-foreground">29°C</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Partly cloudy · Nashik</p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
          Heat warning
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          ["Humidity", "68%"],
          ["Wind", "12 km/h"],
          ["Rain", "0%"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#F5F7F3] px-2 py-2">
            <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentAlerts() {
  return (
    <section className="rounded-xl border border-border/80 bg-white p-6 shadow-soft">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <AlertTriangle className="h-4 w-4 text-rose-500" />
        Recent Alerts
      </h2>
      <div className="rounded-lg border border-border/70 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Coop 3 is warmer than usual</p>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
              High
            </span>
          </div>
          <span className="text-xs text-muted-foreground">4h ago</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Open side vents and refill cool water.</p>
      </div>
    </section>
  );
}
