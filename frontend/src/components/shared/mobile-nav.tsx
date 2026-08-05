"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { navigation } from "@/config/nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useUiStore } from "@/store/use-ui-store";
import { cn } from "@/lib/utils";

/** Slide-in navigation drawer for mobile. */
export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const open = useUiStore((s) => s.activeModal === "mobile-menu");
  const close = useUiStore((s) => s.closeModal);

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? undefined : close())}>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="flex flex-row items-center gap-3 px-5 py-4">
          <Brand />
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-3 pb-6">
          <ScrollArea className="h-[70vh]">
            <nav className="flex flex-col gap-5" aria-label={t("appMenu")}>
              {navigation.map((section, i) => (
                <div key={i}>
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t(section.label.replace("nav.", ""))}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                          )}
                        >
                          <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                          <span className="flex-1 truncate">{t(item.title.replace("nav.", ""))}</span>
                          {item.badge === "new" && (
                            <Badge variant="soft" className="text-[10px]">
                              NEW
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">{t("settings")}</span>
            <div className="flex items-center">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}