"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

/** Brief confirmation shown while the router moves to the dashboard. */
export function AuthSuccess() {
  const t = useTranslations("auth");
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-4 py-16 text-center duration-300 animate-in fade-in"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/12 text-success duration-500 animate-in zoom-in-50">
        <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
      </span>
      <div>
        <p className="text-xl font-semibold">{t("successTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("successSub")}</p>
      </div>
    </div>
  );
}
