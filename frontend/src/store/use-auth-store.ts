"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

export type AuthStatus = "idle" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;

  setSession: (token: string, user: User) => void;
  setUser: (user: User) => void;
  clearSession: () => void;
}

/**
 * Session synced to localStorage for instant restores and offline use.
 * All server-side validation still flows through React Query/TanStack.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      status: "idle",

      setSession: (token, user) => set({ token, user, status: "authenticated" }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ user: null, token: null, status: "unauthenticated" }),
    }),
    {
      name: "flocksy-session",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        status: state.status,
      }),
    },
  ),
);