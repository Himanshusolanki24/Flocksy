"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppTopbar } from "@/components/shared/app-topbar";
import { MobileDock } from "@/components/shared/mobile-dock";
import { MobileNav } from "@/components/shared/mobile-nav";

/**
 * Authenticated app shell: sidebar (desktop), topbar, dock (mobile) and the
 * scrollable content region.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 bg-background pb-20 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      <MobileNav />
      <MobileDock />
    </div>
  );
}