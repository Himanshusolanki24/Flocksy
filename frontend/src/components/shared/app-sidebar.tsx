"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { navigation } from "@/config/nav";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useUiStore } from "@/store/use-ui-store";
import { cn } from "@/lib/utils";

/** Desktop navigation sidebar — minimal, border-right only. */
export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r border-border bg-white text-foreground transition-[width] duration-200 lg:flex",
        collapsed ? "w-[56px]" : "w-56",
      )}
    >
      {/* Brand */}
      <div className={cn("flex h-14 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
        <Brand withWordmark={!collapsed} />
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-4 px-2" aria-label={t("appMenu")}>
          {navigation.map((section, i) => (
            <div key={i}>
              {!collapsed && (
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t(section.label.replace("nav.", ""))}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={t(item.title.replace("nav.", ""))}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-[#EAF3EA] font-medium text-[#225424]"
                          : "text-muted-foreground hover:bg-[#F2F5F0] hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <item.icon
                        className={cn("h-4 w-4 shrink-0", active ? "text-[#225424]" : "text-muted-foreground")}
                        aria-hidden
                      />
                      {!collapsed && (
                        <span className="flex-1 truncate text-[13px]">
                          {t(item.title.replace("nav.", ""))}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}