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
 * Minimalistic top bar — single line, no backdrop blur, hairline border.
 */
export function AppTopbar() {
  const t = useTranslations("nav");
  const router = useRouter();
  const openModal = useUiStore((s) => s.openModal);
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const logout = useLogout();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "PS";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border/70 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 lg:hidden"
        aria-label="Open menu"
        onClick={() => openModal("mobile-menu")}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Search */}
      <button
        onClick={() => openModal("command")}
        className="flex h-9 flex-1 items-center gap-2.5 rounded-lg border border-border/80 bg-[#F4F7F2]/80 px-3 text-xs text-muted-foreground transition-colors hover:border-[#225424]/40 hover:bg-[#F0F5EE] sm:max-w-xs"
        aria-label={t("commandMenu")}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
        <span className="flex-1 truncate text-left font-normal text-muted-foreground/90">Search & commands</span>
        <kbd className="hidden rounded border border-border/80 bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-0.5">
        <ThemeToggle />
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          aria-label={t("notifications")}
          asChild
        >
          <Link href="/notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Profile">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user?.name ?? "Farmer"}</p>
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