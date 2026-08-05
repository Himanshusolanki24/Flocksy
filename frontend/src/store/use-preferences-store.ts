"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";

interface PreferencesState {
  /** Theme applied via next-themes. */
  theme: ThemePreference;
  /** Active app language ("en" | "hi" | future regional codes). */
  language: string;
  /** User-chosen farming activity, used to personalize home. */
  farmType: "poultry" | "dairy" | "livestock" | "crops" | null;
  /** Large-text accessibility mode for low-vision users. */
  largeText: boolean;
  notificationPrefs: {
    push: boolean;
    sms: boolean;
    weatherAlerts: boolean;
    marketAlerts: boolean;
  };

  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: string) => void;
  setFarmType: (farmType: PreferencesState["farmType"]) => void;
  setLargeText: (largeText: boolean) => void;
  setNotificationPref: <K extends keyof PreferencesState["notificationPrefs"]>(
    key: K,
    value: PreferencesState["notificationPrefs"][K],
  ) => void;
}

/**
 * User preferences — the single source of truth for theme, language and
 * notification settings. Persisted to localStorage so preferences survive
 * reloads and work offline.
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      language: "en",
      farmType: null,
      largeText: false,
      notificationPrefs: {
        push: true,
        sms: true,
        weatherAlerts: true,
        marketAlerts: false,
      },

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setFarmType: (farmType) => set({ farmType }),
      setLargeText: (largeText) => set({ largeText }),
      setNotificationPref: (key, value) =>
        set((state) => ({
          notificationPrefs: { ...state.notificationPrefs, [key]: value },
        })),
    }),
    {
      name: "flocksy-preferences",
    },
  ),
);