"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import {
  authService,
  dashboardService,
  diagnosisService,
  vetService,
  weatherService,
  marketService,
  inventoryService,
  feedService,
  medicineService,
  vaccinationService,
  schemeService,
  learningService,
  communityService,
  financeService,
  notificationService,
} from "@/services";
import { useAuthStore } from "@/store/use-auth-store";
import { useNotificationsStore } from "@/store/use-notifications-store";
import type { DiagnosisUploadPayload, LoginRequest, RegisterRequest } from "@/types";
import { setAuthToken } from "@/lib/utils";

/** Centralized query keys keep cache invalidation predictable. */
export const qk = {
  profile: ["profile"] as const,
  dashboard: ["dashboard"] as const,
  weather: ["weather"] as const,
  market: ["market"] as const,
  inventory: ["inventory"] as const,
  feed: ["feed"] as const,
  medicines: ["medicines"] as const,
  vaccinations: ["vaccinations"] as const,
  schemes: ["schemes"] as const,
  vets: ["vets"] as const,
  lessons: ["lessons"] as const,
  community: ["community"] as const,
  finance: ["finance"] as const,
  transactions: ["transactions"] as const,
  notifications: ["notifications"] as const,
};

export function useDashboard() {
  return useQuery({ queryKey: qk.dashboard, queryFn: dashboardService.getSummary });
}

export function useWeather() {
  return useQuery({ queryKey: qk.weather, queryFn: weatherService.get });
}

export function useMarketPrices() {
  return useQuery({ queryKey: qk.market, queryFn: marketService.prices });
}

export function useInventory() {
  return useQuery({ queryKey: qk.inventory, queryFn: inventoryService.list });
}

export function useFeedBatches() {
  return useQuery({ queryKey: qk.feed, queryFn: feedService.batches });
}

export function useMedicines() {
  return useQuery({ queryKey: qk.medicines, queryFn: medicineService.list });
}

export function useVaccinations() {
  return useQuery({ queryKey: qk.vaccinations, queryFn: vaccinationService.list });
}

export function useSchemes() {
  return useQuery({ queryKey: qk.schemes, queryFn: schemeService.list });
}

export function useVets() {
  return useQuery({
    queryKey: qk.vets,
    queryFn: () => vetService.list().then((res) => res.items),
  });
}

export function useLessons() {
  return useQuery({ queryKey: qk.lessons, queryFn: learningService.lessons });
}

export function useCommunityPosts() {
  return useQuery({ queryKey: qk.community, queryFn: communityService.posts });
}

export function useFinance() {
  return useQuery({ queryKey: qk.finance, queryFn: financeService.summary });
}

export function useTransactions() {
  return useQuery({ queryKey: qk.transactions, queryFn: financeService.transactions });
}

export function useNotifications() {
  const setNotifications = useNotificationsStore((s) => s.setNotifications);
  return useQuery({
    queryKey: qk.notifications,
    queryFn: async () => {
      const items = await notificationService.list();
      setNotifications(items);
      return items;
    },
  });
}

/** Sign in: persist session, navigate to dashboard, toast on success. */
export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      setAuthToken(data.token);
      setSession(data.token, data.user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    },
  });
}

/** Register a new farmer account. */
export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: (data) => {
      setAuthToken(data.token);
      setSession(data.token, data.user);
      toast.success("Your farm is ready!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    },
  });
}

/** Log out: clear session and return to the landing page. */
export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);
  return useMutation({
    mutationFn: async () => {
      if (typeof window !== "undefined") setAuthToken(null);
    },
    onSuccess: () => {
      clearSession();
      router.push("/");
    },
  });
}

/** Disease detection upload mutation. */
export function useDiagnosis() {
  return useMutation({
    mutationFn: (payload: DiagnosisUploadPayload) => diagnosisService.uploadImage(payload),
  });
}

/** AI assistant chat mutation (single-turn). */
export function useAiChat() {
  return useMutation({
    mutationFn: ({ query }: { query: string }) => diagnosisService.chat(query),
  });
}

/** Access to the query client for optimistic updates. */
export function useQueryClientApi() {
  return useQueryClient();
}