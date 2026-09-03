"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { navigation } from "@/config/nav";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useUiStore } from "@/store/use-ui-store";
import { AssistantHistory } from "@/features/assistant/history";
import { cn } from "@/lib/utils";

/** Desktop navigation sidebar with collapse support. */
export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const [historyOpen, setHistoryOpen] = useState(true);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-300 lg:flex",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center gap-2 px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <Brand withWordmark={!collapsed} />
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-6 py-3" aria-label={t("appMenu")}>
          {navigation.map((section, i) => (
            <div key={i}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(section.label.replace("nav.", ""))}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          // Clicking the active assistant item toggles its history open/closed.
                          if (item.href === "/assistant" && active) {
                            e.preventDefault();
                            setHistoryOpen((o) => !o);
                          }
                        }}
                        title={t(item.title.replace("nav.", ""))}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            active && "text-primary",
                          )}
                          aria-hidden
                        />
                        {!collapsed && (
                          <span className="flex-1 truncate">
                            {t(item.title.replace("nav.", ""))}
                          </span>
                        )}
                        {!collapsed && item.badge === "new" && (
                          <Badge variant="soft" className="text-[10px]">
                            NEW
                          </Badge>
                        )}
                        {!collapsed &&
                          item.href === "/assistant" &&
                          active &&
                          historyOpen && (
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 transition-transform",
                                !historyOpen && "-rotate-90",
                              )}
                              aria-hidden
                            />
                          )}
                        {active && (
                          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-primary" />
                        )}
                      </Link>
                      {!collapsed &&
                        item.href === "/assistant" &&
                        active &&
                        historyOpen && (
                          <div className="mt-1 pl-2">
                            <AssistantHistory />
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
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
