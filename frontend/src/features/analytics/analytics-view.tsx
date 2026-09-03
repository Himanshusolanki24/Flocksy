"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Award, BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Mortality Rate",
    value: "1.2%",
    change: "↓ 0.3% vs last 7 days",
    positive: true,
  },
  {
    label: "Feed Conversion",
    value: "1.65",
    change: "↓ 0.10 vs last 7 days",
    positive: true,
  },
  {
    label: "Avg. Weight",
    value: "1.42 kg",
    change: "↑ 0.05 vs last 7 days",
    positive: true,
  },
  {
    label: "Cost / Bird",
    value: "₹32.5",
    change: "↓ ₹1.2 vs last 7 days",
    positive: true,
  },
];

export function AnalyticsView() {
  const [range, setRange] = useState("Last 7 Days");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF3EA] to-[#D5E9D5] text-[#225424] shadow-xs border border-[#CDE3CD]/80 ring-2 ring-white">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2922] sm:text-3xl">Analytics</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Track flock growth, mortality, and financial metrics.</p>
          </div>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border/80 bg-white px-3.5 py-2 text-xs font-medium text-foreground shadow-soft hover:bg-muted/30"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{range}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group rounded-xl border border-border/80 bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EAF3EA] text-[#225424] opacity-80 group-hover:opacity-100">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E2922]">{m.value}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Celebration Banner Card */}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-border/80 bg-white p-5 shadow-soft">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3EA] text-[#225424]">
          <Award className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          Great job! Your flock performance is better than last week.
        </p>
      </div>
    </div>
  );
}