import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";

interface DataStateProps {
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  skeleton?: ReactNode;
  children: ReactNode;
}

/**
 * Consistent loading → error → content pipeline for server data.
 * Callers render their own empty states inline when `data.length === 0`.
 */
export function DataState({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  skeleton,
  children,
}: DataStateProps) {
  if (isLoading) {
    return <>{skeleton ?? <DefaultSkeleton />}</>;
  }
  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }
  return <>{children}</>;
}

export function DefaultSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border bg-card p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}