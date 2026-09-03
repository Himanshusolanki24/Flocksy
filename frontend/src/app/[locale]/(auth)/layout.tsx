import type { ReactNode } from "react";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { BrandPanel, FarmStrip } from "@/features/auth/brand-panel";

/**
 * Auth shell: farm story on the left, the form on the right. On mobile the
 * panel collapses to a short strip so the form owns the screen.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[45fr_55fr]">
      <BrandPanel />

      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-8">
          <Brand className="lg:invisible" />
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 pb-12 pt-2 sm:px-8">
          <div className="w-full max-w-md space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
            <div className="lg:hidden">
              <FarmStrip />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
