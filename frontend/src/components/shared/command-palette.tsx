"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { allNavItems, dockItems } from "@/config/nav";
import { useUiStore } from "@/store/use-ui-store";
import { usePreferencesStore } from "@/store/use-preferences-store";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

/**
 * Global command palette (Cmd/Ctrl+K) — fast navigation, theme and
 * language switching for power users while staying accessible.
 */
export function CommandPalette() {
  const t = useTranslations("nav");
  const router = useRouter();
  const open = useUiStore((s) => s.activeModal === "command");
  const close = useUiStore((s) => s.closeModal);
  const openModal = useUiStore((s) => s.openModal);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openModal("command");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, openModal]);

  const run = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={(v) => (v ? openModal("command") : close())}>
      <CommandInput placeholder={t("commandMenu")} />
      <CommandList>
        <CommandEmpty>No match found</CommandEmpty>
        <CommandGroup heading="App">
          {[...allNavItems, ...dockItems]
            .filter((item, i, arr) => arr.findIndex((x) => x.href === item.href) === i)
            .map((item) => (
              <CommandItem key={item.href} onSelect={() => run(item.href)}>
                <item.icon />
                <span>{t(item.title.replace("nav.", ""))}</span>
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Preferences">
          <CommandItem
            onSelect={() => {
              setTheme("light");
              close();
            }}
          >
            <Sun className="h-4 w-4" />
            <span>Light theme</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme("dark");
              close();
            }}
          >
            <Moon className="h-4 w-4" />
            <span>Dark theme</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setLanguage("en");
              close();
            }}
          >
            <span>English</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setLanguage("hi");
              close();
            }}
          >
            <span>हिन्दी</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}