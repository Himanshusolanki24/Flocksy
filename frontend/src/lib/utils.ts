import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Validate an email address with a pragmatic regex. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Read a value as a number, falling back to `fallback`. */
export function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Simple unique id generator (not cryptographically secure). */
export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}

/** Format an amount in Indian Rupees. */
export function formatINR(value: number, options?: { compact?: boolean }): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.compact ? 1 : 0,
    notation: options?.compact ? "compact" : "standard",
  }).format(value);
  return formatted;
}

/** Format a plain number in Indian digit grouping (e.g. 1,00,000). */
export function formatIndianNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

/** Format a percentage with one decimal. */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** Absolute URL helper for metadata/OG tags. */
export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";
  return new URL(path, base.startsWith("http") ? base : `https://${base}`).toString();
}

/** Grab the authenticated token from storage (safe on server). */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("flocksy_token");
}

/** Store the auth token. */
export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem("flocksy_token", token);
  else window.localStorage.removeItem("flocksy_token");
}

/** Read a cached user (lightweight session sync across tabs). */
export function getCachedUser<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("flocksy_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Debounce a function call. */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 250,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** Throttle a function call (leading edge). */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 250,
): (...args: A) => void {
  let last = 0;
  return (...args: A) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

/** Parse a JSON string safely. */
export function safeJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}