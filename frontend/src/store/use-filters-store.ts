"use client";

import { create } from "zustand";

export type DateRangeKey = "last7Days" | "last30Days" | "thisMonth" | "lastYear";

interface FiltersState {
  /** Analytics + reports date range. */
  dateRange: DateRangeKey;
  /** Marketplace commodity filter. */
  commodity: string | null;
  /** Vets specialty filter. */
  specialty: string | null;
  /** Schemes category filter. */
  schemeCategory: string | null;
  /** Learning category filter. */
  lessonCategory: string | null;
  /** Marketplace search text. */
  searchQuery: string;

  setDateRange: (dateRange: DateRangeKey) => void;
  setCommodity: (commodity: string | null) => void;
  setSpecialty: (specialty: string | null) => void;
  setSchemeCategory: (category: string | null) => void;
  setLessonCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

/** Cross-feature filter state shared by list views. */
export const useFiltersStore = create<FiltersState>()((set) => ({
  dateRange: "last7Days",
  commodity: null,
  specialty: null,
  schemeCategory: null,
  lessonCategory: null,
  searchQuery: "",

  setDateRange: (dateRange) => set({ dateRange }),
  setCommodity: (commodity) => set({ commodity }),
  setSpecialty: (specialty) => set({ specialty }),
  setSchemeCategory: (schemeCategory) => set({ schemeCategory }),
  setLessonCategory: (lessonCategory) => set({ lessonCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reset: () =>
    set({
      dateRange: "last7Days",
      commodity: null,
      specialty: null,
      schemeCategory: null,
      lessonCategory: null,
      searchQuery: "",
    }),
}));