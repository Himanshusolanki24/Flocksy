/** Central site configuration used across metadata, OG tags and the app. */
export const siteConfig = {
  name: "Flocksy",
  title: "Flocksy — AI Farm Intelligence for Indian Farmers",
  description:
    "Manage poultry, dairy, livestock and crops with AI. Disease detection, weather, market prices, government schemes and expert advice — in one simple, beautiful app for Indian farmers.",
  keywords: [
    "farm management app",
    "poultry farm app India",
    "dairy farm app",
    "crop advisor",
    "disease detection",
    "smart farming India",
    "AI for farmers",
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