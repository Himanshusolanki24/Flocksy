"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#how", key: "navHow" },
  { href: "#features", key: "navFeatures" },
  { href: "#farm-types", key: "navFarmTypes" },
  { href: "#faq", key: "navFaq" },
];

/** Sticky marketing navigation with mobile support. */
export function MarketingNav() {
  const t = useTranslations("landing");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        scrolled && "border-b bg-background/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Brand />

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map(({ href, key }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" className="text-foreground">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/register">{t("ctaStart")}</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {links.map(({ href, key }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted"
              >
                {t(key)}
              </a>
            ))}
            <Button asChild className="mt-2" size="lg" onClick={() => setOpen(false)}>
              <Link href="/register">{t("ctaStart")}</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}