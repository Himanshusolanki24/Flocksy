"use client";

import { useState } from "react";
import { BarChart3, CloudSun, MessageCircle, ScanSearch, Wheat, X } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Check Disease", icon: ScanSearch },
  { label: "Feed Recommendation", icon: Wheat },
  { label: "Farm Conditions", icon: CloudSun },
  { label: "Farm Insights", icon: BarChart3 },
];

export function FlocksyAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-[min(calc(100vw-2.5rem),22rem)] rounded-2xl border border-[#D9C8B6] bg-[#FFF9EF] p-4 shadow-lift">
          <div className="flex items-start gap-3">
            <ChickenMascot className="h-12 w-12 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-[#173F2A]">Hi! I&apos;m Flocksy 👋</p>
              <p className="mt-1 text-sm leading-relaxed text-[#60705E]">
                Choose what you need help with today.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#60705E] transition-colors hover:bg-[#E8EEDC]"
              aria-label="Close Flocksy assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {actions.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="flex min-h-12 items-center gap-3 rounded-xl border border-[#E7D9C8] bg-white px-3 text-left text-sm font-semibold text-[#173F2A] shadow-sm transition-colors hover:bg-[#F5E7D8]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EEDC] text-[#1E5638]">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#FFF9EF] bg-[#1E5638] shadow-lift transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5638] focus-visible:ring-offset-2",
          open && "bg-[#A95A43]",
        )}
        aria-label={open ? "Close Flocksy assistant" : "Open Flocksy assistant"}
        aria-expanded={open}
      >
        {open ? <MessageCircle className="h-7 w-7 text-white" /> : <ChickenMascot className="h-12 w-12" />}
      </button>
    </div>
  );
}

function ChickenMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="48" cy="50" r="34" fill="#FFF3D0" />
      <path d="M33 37c-8 6-12 15-10 25 3 14 17 22 31 19 17-3 28-17 25-34-3-14-15-22-29-22-6 0-12 2-17 6Z" fill="#F9D987" />
      <path d="M35 31c3-11 17-14 25-6 7 7 7 18-1 25-7 7-19 7-25-1-4-5-3-12 1-18Z" fill="#FFF9EF" />
      <path d="M42 21c-2-7 3-12 8-12 0 5 2 8 6 10 3 2 4 6 2 9-5-4-10-6-16-7Z" fill="#D96043" />
      <path d="M61 34l13 5-13 7c1-4 1-8 0-12Z" fill="#E9A93C" />
      <circle cx="47" cy="34" r="3.6" fill="#173F2A" />
      <path d="M37 50c8 8 20 8 28-1" stroke="#9A5A35" strokeWidth="3" strokeLinecap="round" />
      <path d="M43 78l-5 8M55 78l5 8" stroke="#A95A43" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
