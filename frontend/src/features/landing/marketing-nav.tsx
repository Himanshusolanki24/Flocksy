"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/shared/brand";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#how", key: "navHow" },
  { href: "#features", key: "navFeatures" },
  { href: "#faq", key: "navFaq" },
];

/** Sticky marketing navigation. Transparent over the paper until scrolled. */
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
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled && "border-b bg-background/85 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-6 px-6">
        <Brand />

        <nav className="ml-4 hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map(({ href, key }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        {/* ponytail: no theme toggle — this surface is light only */}
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher />
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t("signIn")}
          </Link>
          <Button asChild className="rounded-full px-5">
            <Link href="/register">{t("ctaStart")}</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t bg-background md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map(({ href, key }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base hover:bg-muted"
              >
                {t(key)}
              </a>
            ))}
            <Button asChild className="mt-3 rounded-full" onClick={() => setOpen(false)}>
              <Link href="/register">{t("ctaStart")}</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
