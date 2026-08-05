import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  subtext?: ReactNode;
  icon?: LucideIcon;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  className?: string;
}

/** Large, tap-friendly KPI card. */
export function StatCard({ label, value, subtext, icon: Icon, trend, trendLabel, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
        </div>
        {Icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
      {subtext || trend ? (
        <div className="mt-3 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "flex h-5 items-center rounded-full px-2 text-[11px] font-semibold",
                trend === "up" && "bg-success/15 text-success",
                trend === "down" && "bg-destructive/15 text-destructive",
                trend === "flat" && "bg-muted text-muted-foreground",
              )}
            >
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "▪"} {trendLabel}
            </span>
          )}
          {subtext ? <span className="text-xs text-muted-foreground">{subtext}</span> : null}
        </div>
      ) : null}
    </Card>
  );
}