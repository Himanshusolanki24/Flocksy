import type { ReactNode } from "react";
import { AppShell } from "@/components/shared/app-shell";

/**
 * Authenticated area layout — all dashboard pages share the app shell
 * (sidebar + topbar + mobile dock).
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}