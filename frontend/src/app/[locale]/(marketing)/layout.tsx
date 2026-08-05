import type { ReactNode } from "react";
import { MarketingNav } from "@/features/landing/marketing-nav";
import { MarketingFooter } from "@/features/landing/marketing-footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}