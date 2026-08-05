"use client";

import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {error}
    </p>
  );
}

interface BaseProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {}

export function TextField({
  label,
  error,
  hint,
  required,
  className,
  id,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <Label htmlFor={inputId}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <Input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        required={required}
        {...props}
      />
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <ErrorText id={errorId} error={error} />
    </div>
  );
}

interface TextareaFieldProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextareaField({
  label,
  error,
  hint,
  required,
  className,
  id,
  ...props
}: TextareaFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <Label htmlFor={inputId}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <Textarea
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        required={required}
        {...props}
      />
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <ErrorText id={errorId} error={error} />
    </div>
  );
}

interface SelectFieldProps extends BaseProps, SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function NativeSelectField({
  label,
  error,
  hint,
  required,
  options,
  className,
  id,
  ...props
}: SelectFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <Label htmlFor={inputId}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <select
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        required={required}
        className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <ErrorText id={errorId} error={error} />
    </div>
  );
}