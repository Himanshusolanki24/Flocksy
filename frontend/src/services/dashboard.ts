import { http } from "./http";
import { mockDashboard } from "@/lib/mock";
import type { DashboardSummary } from "@/types";

/**
 * Load the dashboard summary.
 * Falls back to realistic seed data when the backend is unreachable so the
 * product demo never breaks (useful in development / on hosted previews).
 */
export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    try {
      return await http.get<DashboardSummary>("/dashboard/summary");
    } catch {
      return mockDashboard() as unknown as DashboardSummary;
    }
  },
};