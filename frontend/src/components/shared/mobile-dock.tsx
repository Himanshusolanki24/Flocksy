"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { dockItems } from "@/config/nav";
import { cn } from "@/lib/utils";

/**
 * Touch-friendly bottom dock for mobile users.
 * Always visible with large tap targets — ideal for low-literacy use.
 */
export function MobileDock() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("appMenu")}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="grid h-16 grid-cols-5">
        {dockItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={t(item.title.replace("nav.", ""))}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "scale-110 transition-transform")} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[11px]">{t(item.title.replace("nav.", ""))}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}