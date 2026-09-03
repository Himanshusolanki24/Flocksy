"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** An `auth` message key, translated here so validation stays localised. */
  error?: string;
  hint?: string;
}

function FieldError({ id, error }: { id: string; error?: string }) {
  const t = useTranslations("auth");
  if (!error) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-destructive">
      {t(error)}
    </p>
  );
}

/** +91 prefixed, 10-digit mobile entry — the primary way farmers sign in. */
export const MobileInput = forwardRef<HTMLInputElement, FieldProps>(
  function MobileInput({ label, error, hint, className, id, ...props }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <div
          className={cn(
            "flex h-12 items-center overflow-hidden rounded-lg border bg-background transition-colors focus-within:ring-2 focus-within:ring-ring",
            error && "border-destructive",
            className,
          )}
        >
          <span className="flex h-full select-none items-center border-r bg-muted/60 px-3 text-sm font-medium text-muted-foreground">
            +91
          </span>
          <input
            ref={ref}
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={11}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground"
            {...props}
          />
        </div>
        {hint && !error ? (
          <p className="text-sm text-muted-foreground">{hint}</p>
        ) : null}
        <FieldError id={errorId} error={error} />
      </div>
    );
  },
);

interface PasswordProps extends FieldProps {
  /** Show the strength meter (signup only — never on login). */
  withStrength?: boolean;
  value?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordProps>(
  function PasswordInput(
    { label, error, hint, withStrength, value, id, ...props },
    ref,
  ) {
    const t = useTranslations("auth");
    const [visible, setVisible] = useState(false);
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            value={value}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "h-12 pr-12 text-base",
              error && "border-destructive",
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t("hidePassword") : t("showPassword")}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {visible ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {withStrength ? <PasswordStrength value={value ?? ""} /> : null}
        {hint && !error ? (
          <p className="text-sm text-muted-foreground">{hint}</p>
        ) : null}
        <FieldError id={errorId} error={error} />
      </div>
    );
  },
);

/** Three honest levels, no checklist to wade through. */
function PasswordStrength({ value }: { value: string }) {
  const t = useTranslations("auth");
  if (!value) return null;

  const score =
    (value.length >= 8 ? 1 : 0) +
    (/[A-Za-z]/.test(value) && /\d/.test(value) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(value) || value.length >= 12 ? 1 : 0);
  const level = score >= 3 ? 2 : score === 2 ? 1 : 0;
  const label = [t("strengthWeak"), t("strengthGood"), t("strengthStrong")][
    level
  ];
  const tone = ["bg-destructive", "bg-warning", "bg-success"][level];
  const text = ["text-destructive", "text-warning", "text-success"][level];

  return (
    <div className="flex items-center gap-2 pt-0.5">
      <div className="flex flex-1 gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i <= level ? tone : "bg-muted",
            )}
          />
        ))}
      </div>
      <span className={cn("text-xs font-medium", text)}>
        <span className="sr-only">{t("strengthLabel")}: </span>
        {label}
      </span>
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, FieldProps>(
  function TextInput({ label, error, hint, id, ...props }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn("h-12 text-base", error && "border-destructive")}
          {...props}
        />
        {hint && !error ? (
          <p className="text-sm text-muted-foreground">{hint}</p>
        ) : null}
        <FieldError id={errorId} error={error} />
      </div>
    );
  },
);
