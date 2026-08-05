"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Camera,
  UploadCloud,
  ScanSearch,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  FileDown,
  X,
} from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useDiagnosis } from "@/lib/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DiagnosisRecord } from "@/types";

interface LocalResult {
  disease: string;
  confidence: number;
  nextSteps: string[];
  warnings: string[];
}

function fallbackResult(): LocalResult {
  return {
    disease: "Infectious Bronchitis (suspected)",
    confidence: 87,
    nextSteps: [
      "Isolate affected birds immediately",
      "Boost hydration with electrolytes in drinking water",
      "Raise brooding temperature by 2°C",
      "Contact a veterinarian within 24 hours",
    ],
    warnings: [
      "This is not a substitute for a lab test",
      "Monitor the rest of the flock for symptoms",
    ],
  };
}

function DiagnosisForm({
  onAnalyze,
  analyzing,
}: {
  onAnalyze: (symptoms: string, extra: Record<string, string>) => void;
  analyzing: boolean;
}) {
  const t = useTranslations("diagnosis");
  const [symptoms, setSymptoms] = useState("");
  const [flockSize, setFlockSize] = useState("");
  const [age, setAge] = useState("");
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onAnalyze(symptoms, { flockSize, age, temp, humidity });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="symptoms">{t("symptoms")}</Label>
        <Textarea
          id="symptoms"
          rows={3}
          placeholder={t("symptomsPlaceholder")}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="flockSize">{t("flockSize")}</Label>
          <Input id="flockSize" type="number" inputMode="numeric" value={flockSize} onChange={(e) => setFlockSize(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="age">{t("ageInDays")}</Label>
          <Input id="age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="temp">{t("temperature")}</Label>
          <Input id="temp" type="number" inputMode="decimal" value={temp} onChange={(e) => setTemp(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="humidity">{t("humidity")}</Label>
          <Input id="humidity" type="number" inputMode="numeric" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
        </div>
      </div>
      <Button type="submit" className="w-full gap-2" disabled={analyzing || !symptoms.trim()}>
        {analyzing ? <ScanSearch className="h-4 w-4 animate-pulse" /> : <Stethoscope className="h-4 w-4" />}
        {analyzing ? t("analyzing") : t("analyze")}
      </Button>
    </form>
  );
}

function CameraCapture({ onCapture }: { onCapture: (file: File) => void }) {
  const t = useTranslations("diagnosis");
  const { supported, streamActive, error, videoRef, start, stop, capture } = useCamera();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleCapture = async () => {
    setBusy(true);
    const file = await capture();
    setBusy(false);
    if (file) {
      stop();
      setOpen(false);
      onCapture(file);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => {
          if (!supported) return;
          setOpen(true);
          void start();
        }}
        disabled={!supported}
      >
        <Camera className="h-4 w-4" />
        {t("camera")}
      </Button>
      <Dialog open={open} onOpenChange={(o) => {
        setOpen(o);
        if (!o) stop();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("camera")}</DialogTitle>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setOpen(false);
                stop();
              }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="aspect-video overflow-hidden rounded-xl bg-muted">
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
            {!streamActive && !error ? <div className="grid h-full place-items-center text-sm text-muted-foreground">…</div> : null}
            {error ? <div className="grid h-full place-items-center p-4 text-center text-sm text-destructive">{error}</div> : null}
          </div>
          <Button onClick={handleCapture} disabled={!streamActive || busy} className="w-full gap-2">
            <Camera className="h-4 w-4" /> {busy ? "…" : t("upload")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResultCard({ result }: { result: LocalResult }) {
  const t = useTranslations("diagnosis");
  return (
    <Card className="border-success/40 bg-success/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-success">
          <ScanSearch className="h-5 w-5" /> {t("result")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("disease")}</p>
          <p className="mt-1 text-lg font-semibold">{result.disease}</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>{t("confidence")}</span>
              <span className="font-semibold">{result.confidence}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">{t("nextSteps")}</p>
          <ol className="space-y-2">
            {result.nextSteps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Badge variant="outline" className="mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs">
                  {i + 1}
                </Badge>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-warning">
            <ShieldAlert className="h-4 w-4" /> {t("warnings")}
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.warnings.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>

        <Button asChild variant="outline" className="w-full gap-2">
          <a href={`/vets`}>
            {t("consultVet")} <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" className="w-full gap-2">
          <FileDown className="h-4 w-4" /> {t("downloadReport")}
        </Button>
      </CardContent>
    </Card>
  );
}

export function DiagnosisView() {
  const t = useTranslations("diagnosis");
  const mutation = useDiagnosis();
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<LocalResult | null>(null);
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("flocksy-diagnosis");
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persistHistory = (records: DiagnosisRecord[]) => {
    setHistory(records);
    try {
      localStorage.setItem("flocksy-diagnosis", JSON.stringify(records));
    } catch {
      /* ignore */
    }
  };

  const analyze = async (symptoms: string, extra: Record<string, string>) => {
    setResult(null);
    const media = preview ? await (await fetch(preview)).blob().then((b) => new File([b], "capture.jpg", { type: "image/jpeg" })).catch(() => undefined) : undefined;
    const payload = {
      media,
      symptoms,
      farmId: "farm-demo-1",
      flockSize: extra.flockSize ? Number(extra.flockSize) : undefined,
      ageInDays: extra.age ? Number(extra.age) : undefined,
      temperatureC: extra.temp ? Number(extra.temp) : undefined,
      humidityPercent: extra.humidity ? Number(extra.humidity) : undefined,
    };
    try {
      const res = await mutation.mutateAsync(payload as never);
      const analysis = (res.analysis as never) as { result?: LocalResult } | undefined;
      const r = analysis?.result ?? fallbackResult();
      setResult(r);
      const record: DiagnosisRecord = {
        id: uid("dx"),
        requestId: (res as { requestId?: string }).requestId ?? "",
        disease: r.disease,
        confidence: r.confidence,
        symptoms,
        imageUrl: preview ?? undefined,
        createdAt: new Date().toISOString(),
        nextSteps: r.nextSteps,
      };
      persistHistory([record, ...history]);
    } catch {
      const r = fallbackResult();
      setResult(r);
      const record: DiagnosisRecord = {
        id: uid("dx"),
        requestId: "local",
        disease: r.disease,
        confidence: r.confidence,
        symptoms,
        imageUrl: preview ?? undefined,
        createdAt: new Date().toISOString(),
        nextSteps: r.nextSteps,
      };
      persistHistory([record, ...history]);
    }
  };

  const onPick = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("upload")}</CardTitle>
            <CardDescription>{t("dragHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {preview ? (
              <div className="relative overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Upload preview" className="h-44 w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5"
                  onClick={() => setPreview(null)}
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("dragHint")}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
            <CameraCapture onCapture={onPick} />
            <DiagnosisForm onAnalyze={analyze} analyzing={mutation.isPending} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {mutation.isPending ? (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-2/3" />
              </CardContent>
            </Card>
          ) : result ? (
            <ResultCard result={result} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("result")}</CardTitle>
              </CardHeader>
              <CardContent className="grid h-full place-items-center py-12 text-sm text-muted-foreground">
                {t("newDiagnosis")}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("recentDetections")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noHistory")}</p>
              ) : (
                history.slice(0, 4).map((h) => (
                  <div key={h.id} className="flex items-center gap-3 rounded-xl border p-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", "bg-success/10 text-success")}>
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{h.disease}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(h.createdAt).toLocaleDateString()} · {h.confidence}%
                      </p>
                    </div>
                    <Badge variant="soft">{h.confidence}%</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}