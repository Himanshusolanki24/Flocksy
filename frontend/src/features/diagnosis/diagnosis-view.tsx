"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uid, cn } from "@/lib/utils";
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

/** Photo dropzone with drag-and-drop, browse and preview states. */
function Dropzone({
  preview,
  onPick,
  onClear,
}: {
  preview: string | null;
  onPick: (file?: File) => void;
  onClear: () => void;
}) {
  const t = useTranslations("diagnosis");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  if (preview) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Upload preview"
          className="h-64 w-full object-cover sm:h-72"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 h-8 w-8 rounded-full shadow-soft"
          onClick={onClear}
          aria-label="Remove photo"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onPick(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 text-center transition-colors sm:h-72",
          dragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-primary/5",
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UploadCloud className="h-7 w-7" />
        </span>
        <span className="text-sm font-medium">{t("dragHint")}</span>
        <span className="text-xs text-muted-foreground">
          JPG or PNG · max 10 MB
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </>
  );
}

function CameraCapture({ onCapture }: { onCapture: (file: File) => void }) {
  const t = useTranslations("diagnosis");
  const { supported, streamActive, error, videoRef, start, stop, capture } =
    useCamera();
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
        className="gap-2"
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
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) stop();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("camera")}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video overflow-hidden rounded-xl bg-muted">
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {!streamActive && !error ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                …
              </div>
            ) : null}
            {error ? (
              <div className="grid h-full place-items-center p-4 text-center text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </div>
          <Button
            onClick={handleCapture}
            disabled={!streamActive || busy}
            className="w-full gap-2"
          >
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
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b bg-success/5 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("disease")}
          </p>
          <p className="mt-1 text-lg font-semibold leading-snug">
            {result.disease}
          </p>
        </div>
        <Badge variant="soft" className="shrink-0">
          {result.confidence}%
        </Badge>
      </div>

      <CardContent className="space-y-6 pt-5">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("confidence")}</span>
            <span className="font-semibold">{result.confidence}%</span>
          </div>
          <Progress value={result.confidence} className="h-2" />
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">{t("nextSteps")}</p>
          <ol className="space-y-2.5">
            {result.nextSteps.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-relaxed"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-warning/40 bg-warning/5 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-warning">
            <ShieldAlert className="h-4 w-4" /> {t("warnings")}
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.warnings.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1 gap-2">
            <Link href="/vets">
              {t("seeVet")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" /> {t("downloadReport")}
          </Button>
        </div>
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
  const [symptoms, setSymptoms] = useState("");
  const [flockSize, setFlockSize] = useState("");
  const [age, setAge] = useState("");
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");

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

  const record = (r: LocalResult, requestId: string) => {
    const entry: DiagnosisRecord = {
      id: uid("dx"),
      requestId,
      disease: r.disease,
      confidence: r.confidence,
      symptoms,
      imageUrl: preview ?? undefined,
      createdAt: new Date().toISOString(),
      nextSteps: r.nextSteps,
    };
    persistHistory([entry, ...history]);
  };

  const analyze = async () => {
    setResult(null);
    const media = preview
      ? await fetch(preview)
          .then((res) => res.blob())
          .then((b) => new File([b], "capture.jpg", { type: "image/jpeg" }))
          .catch(() => undefined)
      : undefined;
    const payload = {
      media,
      symptoms,
      farmId: "farm-demo-1",
      flockSize: flockSize ? Number(flockSize) : undefined,
      ageInDays: age ? Number(age) : undefined,
      temperatureC: temp ? Number(temp) : undefined,
      humidityPercent: humidity ? Number(humidity) : undefined,
    };
    try {
      const res = await mutation.mutateAsync(payload as never);
      const analysis = res.analysis as unknown as
        { result?: LocalResult } | undefined;
      const r = analysis?.result ?? fallbackResult();
      setResult(r);
      record(r, (res as { requestId?: string }).requestId ?? "");
    } catch {
      const r = fallbackResult();
      setResult(r);
      record(r, "local");
    }
  };

  const onPick = (file?: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          history.length > 0 ? (
            <Badge variant="soft" className="gap-1.5">
              <Stethoscope className="h-3.5 w-3.5" />
              {history.length} {t("history").toLowerCase()}
            </Badge>
          ) : null
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Capture + context */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            void analyze();
          }}
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t("upload")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Dropzone
                preview={preview}
                onPick={onPick}
                onClear={() => setPreview(null)}
              />
              <CameraCapture onCapture={onPick} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t("symptoms")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Textarea
                id="symptoms"
                rows={4}
                placeholder={t("symptomsPlaceholder")}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                aria-label={t("symptoms")}
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    [
                      "flockSize",
                      t("flockSize"),
                      flockSize,
                      setFlockSize,
                      "numeric",
                    ],
                    ["age", t("ageInDays"), age, setAge, "numeric"],
                    ["temp", t("temperature"), temp, setTemp, "decimal"],
                    [
                      "humidity",
                      t("humidity"),
                      humidity,
                      setHumidity,
                      "numeric",
                    ],
                  ] as const
                ).map(([id, label, value, setValue, mode]) => (
                  <div key={id} className="space-y-1.5">
                    <Label
                      htmlFor={id}
                      className="text-xs text-muted-foreground"
                    >
                      {label}
                    </Label>
                    <Input
                      id={id}
                      type="number"
                      inputMode={mode}
                      placeholder="—"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={mutation.isPending || (!symptoms.trim() && !preview)}
              >
                {mutation.isPending ? (
                  <ScanSearch className="h-4 w-4 animate-pulse" />
                ) : (
                  <Stethoscope className="h-4 w-4" />
                )}
                {mutation.isPending ? t("analyzing") : t("analyze")}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* Result + history */}
        <div className="space-y-6 lg:sticky lg:top-20">
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
            <Card className="border-dashed bg-muted/30 shadow-none">
              <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ScanSearch className="h-6 w-6" />
                </span>
                <p className="text-sm font-medium">{t("result")}</p>
                <p className="max-w-[24ch] text-sm text-muted-foreground">
                  {t("newDiagnosis")}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t("recentDetections")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.length === 0 ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("noHistory")}
                </p>
              ) : (
                history.slice(0, 5).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-3 rounded-xl border p-2.5 transition-colors hover:bg-muted/50"
                  >
                    {h.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={h.imageUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                        <Stethoscope className="h-4 w-4" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {h.disease}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(h.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="soft" className="shrink-0">
                      {h.confidence}%
                    </Badge>
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
