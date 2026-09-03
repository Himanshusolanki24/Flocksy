import type { FarmType, TransactionCategory } from "@/types";

/** App-wide constants — keep values here, never in components. */

export const APP_VERSION = "1.0.0";

export const SUPPORT_EMAIL = "support@flocksy.app";

export const FARM_TYPES: { value: FarmType; icon: string }[] = [
  { value: "poultry", icon: "🐔" },
];

/** Transaction categories keyed to translation messages. */
export const TRANSACTION_CATEGORIES: {
  value: TransactionCategory;
  kind: "income" | "expense";
}[] = [
  { value: "sellEggs", kind: "income" },
  { value: "sellBirds", kind: "income" },
  { value: "feedPurchase", kind: "expense" },
  { value: "vetVisit", kind: "expense" },
  { value: "medicine", kind: "expense" },
  { value: "other", kind: "expense" },
];

/** Inventory unit presets (Indian market friendly). */
export const INVENTORY_UNITS = ["kg", "g", "l", "ml", "bags", "units", "dozen"];

/** Chart palette, tied to --chart-* CSS variables. */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

/** Severity -> tailwind color token mapping. */
export const SEVERITY_TONES = {
  critical: "text-destructive",
  warning: "text-warning",
  info: "text-info",
} as const;

export const STOCK_TONES = {
  "in-stock": "text-success",
  "low-stock": "text-warning",
  "out-of-stock": "text-destructive",
} as const;

export const VACCINATION_TONES = {
  completed: "text-success",
  scheduled: "text-info",
  overdue: "text-destructive",
} as const;

/** max daily message retries / pagination page size */
export const PAGE_SIZE = 20;

export const QUERY_STALE_TIME = 60_000; // 1 min

export const QUERY_CACHE_TIME = 5 * 60_000; // 5 min