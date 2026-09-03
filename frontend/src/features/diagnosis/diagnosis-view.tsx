"use client";

import { useState } from "react";
import {
  UploadCloud,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  X,
  ScanSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const commonDiseases = [
  {
    name: "Coccidiosis",
    desc: "Bloody stool, poor growth",
    iconBg: "bg-rose-50 text-rose-500",
  },
  {
    name: "Respiratory Disease",
    desc: "Coughing, sneezing, nasal discharge",
    iconBg: "bg-orange-50 text-orange-500",
  },
  {
    name: "Heat Stress",
    desc: "Panting, weakness, high mortality",
    iconBg: "bg-amber-50 text-amber-500",
  },
  {
    name: "Ranikhet Disease",
    desc: "Sudden death, greenish diarrhea",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
];

export function DiagnosisView() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    advice: string;
  } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setResult({
          disease: "Heat Stress (Mild)",
          confidence: 94,
          advice: "Provide cool water with electrolytes, increase cross-ventilation in the coop, and reduce flock density.",
        });
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF3EA] to-[#D5E9D5] text-[#225424] shadow-xs border border-[#CDE3CD]/80 ring-2 ring-white">
          <ScanSearch className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2922] sm:text-3xl">Disease Detection</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Identify poultry health issues early and act faster.</p>
        </div>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1.3fr_0.9fr]">
        {/* Card 1: Upload Bird Image */}
        <div className="rounded-xl border border-border/80 bg-white p-6 shadow-soft">
          <label className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#CFDDCB] bg-[#FAFBF9] p-6 text-center transition-colors hover:border-[#225424] hover:bg-[#F2F7F1]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3EA] text-[#225424]">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="text-base font-semibold text-foreground">Upload bird image</p>
            <p className="my-1 text-xs text-muted-foreground">or</p>
            <p className="text-sm font-medium text-foreground">Drag & drop here</p>
            <p className="mt-2 text-xs text-muted-foreground/80">JPG, PNG up to 5MB</p>
          </label>

          {analyzing && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-[#225424]">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#225424] border-t-transparent" />
              Analyzing image with Flocksy AI...
            </div>
          )}

          {result && !analyzing && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="font-semibold text-emerald-900">{result.disease}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-emerald-800">Confidence: {result.confidence}%</p>
              <p className="mt-2 text-xs leading-relaxed text-emerald-900">{result.advice}</p>
            </div>
          )}
        </div>

        {/* Card 2: Common Diseases */}
        <div className="rounded-xl border border-border/80 bg-white p-6 shadow-soft">
          <h2 className="mb-5 text-sm font-semibold text-foreground">Common Diseases</h2>
          <div className="space-y-4">
            {commonDiseases.map((d) => (
              <div key={d.name} className="flex items-start gap-3.5">
                <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", d.iconBg)}>
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Tip */}
        <div className="rounded-xl border border-border/80 bg-white p-6 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-amber-500">
            <Lightbulb className="h-5 w-5 fill-amber-400 text-amber-500" />
          </div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Tip</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Clear images in good light help Flocksy detect faster and more accurately.
          </p>
        </div>
      </div>
    </div>
  );
}
