"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/shared/brand";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#features", label: "Features" },
  { href: "#farmer-first", label: "For Farmers" },
  { href: "#how", label: "How It Works" },
];

export function MarketingNav() {
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
        scrolled ? "border-b border-[#E7D9C8] bg-[#FFF9EF]/90 backdrop-blur-md" : "bg-[#FFF9EF]",
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Brand />

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-[#4F5F50] transition-colors hover:bg-[#E8EEDC] hover:text-[#173F2A]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" className="text-[#173F2A]">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="lg" className="bg-[#1E5638] text-white hover:bg-[#173F2A]">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-[#173F2A] md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-[#E7D9C8] bg-[#FFF9EF] md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-4 text-base font-semibold text-[#173F2A] hover:bg-[#E8EEDC]"
              >
                {label}
              </a>
            ))}
            <Button asChild size="lg" className="mt-2 bg-[#1E5638] text-white hover:bg-[#173F2A]">
              <Link href="/register" onClick={() => setOpen(false)}>
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
