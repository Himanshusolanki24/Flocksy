"use client";

import { Menu, Search, Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useUiStore } from "@/store/use-ui-store";
import { useNotificationsStore } from "@/store/use-notifications-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useLogout } from "@/lib/queries";

/**
 * Persistent top bar: mobile menu, command palette search trigger,
 * theme/language shortcuts, notifications and the profile menu.
 */
export function AppTopbar() {
  const t = useTranslations("nav");
  const router = useRouter();
  const openModal = useUiStore((s) => s.openModal);
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const logout = useLogout();

  const initials = (user?.name ?? "F")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => openModal("mobile-menu")}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <button
        onClick={() => openModal("command")}
        className="group flex h-10 flex-1 items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:max-w-sm"
        aria-label={t("commandMenu")}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-left">{t("commandMenu")}</span>
        <kbd className="hidden rounded border bg-background px-1.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("notifications")}
          asChild
        >
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profile">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{user?.name ?? "Farmer"}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.email ?? ""}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={logout.isPending}
              onSelect={() => logout.mutate()}
            >
              {t("logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}