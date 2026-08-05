"use client";

import { Languages } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePreferencesStore } from "@/store/use-preferences-store";

/** Locale switcher using next-intl's locale-aware router. */
export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const setLanguage = usePreferencesStore((s) => s.setLanguage);

  const onSelect = (next: string) => {
    setLanguage(next);
    router.replace(pathname, { locale: next as (typeof routing.locales)[number] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Language">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => onSelect("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect("hi")}>हिन्दी</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}