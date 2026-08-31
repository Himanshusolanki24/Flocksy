import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Noto_Sans_Devanagari,
} from "next/font/google";

/**
 * Typography — loaded once at the app root.
 *
 * - Geist: primary UI sans (Latin) for crisp, premium interface text.
 * - Noto Sans Devanagari: fallback for Hindi/English mixed UI so the whole
 *   Devanagari script is always rendered beautifully.
 * - Playfair Display: high-contrast editorial display face for the marketing
 *   headlines. Italic is loaded too — the landing page pairs roman and italic
 *   within a single headline.
 */
export const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontDisplay = Playfair_Display({
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const fontDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** CSS variable names applied to <html> by the layout. */
export const fontVariables = [
  fontSans.variable,
  fontMono.variable,
  fontDisplay.variable,
  fontDevanagari.variable,
]
  .join(" ")
  .trim();