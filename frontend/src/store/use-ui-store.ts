"use client";

import { create } from "zustand";

export type ModalName =
  | "command"
  | "mobile-menu"
  | "language"
  | "list-produce"
  | "book-vet"
  | "add-inventory"
  | "add-feed"
  | "add-medicine"
  | "schedule-vaccination"
  | "add-transaction"
  | "generate-report";

interface UiState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  activeModal: ModalName | null;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  openModal: (modal: ModalName) => void;
  closeModal: () => void;
}

/**
 * Lightweight UI state (sidebar, modals) that doesn't need server state.
 */
export const useUiStore = create<UiState>()((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  activeModal: null,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setSidebarMobileOpen: (sidebarMobileOpen) => set({ sidebarMobileOpen }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
}));