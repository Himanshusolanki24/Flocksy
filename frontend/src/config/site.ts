/** Central site configuration used across metadata, OG tags and the app. */
export const siteConfig = {
  name: "Flocksy",
  title: "Flocksy — AI Poultry Farm Intelligence for Indian Farmers",
  description:
    "Manage your poultry flock with AI. Flock health tracking, bird disease detection, weather alerts, feed management and poultry expert advice — in one simple, beautiful app for poultry farmers.",
  keywords: [
    "poultry farm app India",
    "poultry disease detection",
    "broiler farm management",
    "layer farm tracker",
    "flock health monitoring",
    "smart poultry farming",
    "AI for poultry farmers",
  ] as string[],
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  twitter: "@flocksy",
  developer: "Flocksy",
  links: {
    twitter: "https://twitter.com/flocksy",
    github: "https://github.com/flocksy",
  },
  // Backend
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1",
} as const;

export type SiteConfig = typeof siteConfig;