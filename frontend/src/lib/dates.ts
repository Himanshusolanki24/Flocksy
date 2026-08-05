import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

/** Human-friendly "time ago" label. */
export function timeAgo(iso: string | Date): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

/** Relative day label: Today / Yesterday / date. */
export function dayLabel(iso: string | Date): string {
  const date = new Date(iso);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
}

/** Short time-of-day label for schedules, e.g. 05:00 PM. */
export function timeLabel(iso: string | Date): string {
  return format(new Date(iso), "h:mm a");
}

/** Full readable date, e.g. 15 Aug 2026. */
export function dateLabel(iso: string | Date): string {
  return format(new Date(iso), "d MMM yyyy");
}

/** ISO date for form inputs (yyyy-MM-dd). */
export function toDateInputValue(iso: string | Date): string {
  return format(new Date(iso), "yyyy-MM-dd");
}

export { format, formatDistanceToNow };