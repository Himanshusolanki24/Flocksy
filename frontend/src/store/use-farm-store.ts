"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Farm } from "@/types";

interface FarmState {
  farms: Farm[];
  activeFarmId: string | null;

  setFarms: (farms: Farm[]) => void;
  setActiveFarmId: (farmId: string | null) => void;
  addFarm: (farm: Farm) => void;
  updateFarm: (farm: Farm) => void;
}

/**
 * Client-side farm registry. The selected farm scopes every dashboard query.
 */
export const useFarmStore = create<FarmState>()(
  persist(
    (set) => ({
      farms: [],
      activeFarmId: null,

      setFarms: (farms) =>
        set((state) => ({
          farms,
          activeFarmId: state.activeFarmId ?? farms[0]?.id ?? null,
        })),
      setActiveFarmId: (activeFarmId) => set({ activeFarmId }),
      addFarm: (farm) =>
        set((state) => ({
          farms: [...state.farms, farm],
          activeFarmId: state.activeFarmId ?? farm.id,
        })),
      updateFarm: (farm) =>
        set((state) => ({
          farms: state.farms.map((f) => (f.id === farm.id ? farm : f)),
        })),
    }),
    { name: "flocksy-farms" },
  ),
);