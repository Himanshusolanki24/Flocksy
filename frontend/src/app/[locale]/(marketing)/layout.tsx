import type { ReactNode } from "react";
import { MarketingNav } from "@/features/landing/marketing-nav";
import { MarketingFooter } from "@/features/landing/marketing-footer";
import { MotionProvider, ScrollProgress } from "@/features/landing/motion";

/**
 * `paper` re-points the design tokens to the warm editorial palette for the
 * marketing surface only — the in-app UI keeps the standard theme.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="paper flex min-h-screen flex-col bg-background text-foreground antialiased">
        <ScrollProgress />
        <MarketingNav />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </MotionProvider>
  );
}
