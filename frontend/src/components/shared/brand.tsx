import { cn } from "@/lib/utils";
import { Sprout } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface BrandProps {
  className?: string;
  withWordmark?: boolean;
  href?: string;
}

/**
 * Flocksy brand mark — a sprout glyph in a rounded square, plus wordmark.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <Sprout className="h-5 w-5" strokeWidth={2.2} />
    </span>
  );
}

export function Brand({ className, withWordmark = true, href = "/" }: BrandProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Flocksy home">
      <BrandMark />
      {withWordmark ? <span className="text-lg font-semibold tracking-tight">Flocksy</span> : null}
    </Link>
  );
}