import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Consistent page header with optional icon badge and action row. */
export function PageHeader({ title, description, icon, badge, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-start sm:items-center gap-3.5">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EAF3EA] to-[#D5E9D5] text-[#225424] shadow-xs border border-[#CDE3CD]/80 ring-2 ring-white">
            {icon}
          </div>
        )}
        <div className="space-y-0.5">
          {badge && <div className="mb-1">{badge}</div>}
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2922] sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}