"use client";

import { useState, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from "@tanstack/react-query";
import { QUERY_CACHE_TIME, QUERY_STALE_TIME } from "@/constants";

/** Respect the browser's online/offline status for query refetching. */
if (typeof window !== "undefined" && "onLine" in window) {
  onlineManager.setEventListener((setOnline) => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    return () => {};
  });
}

/**
 * Global server-state provider.
 * A single, memoized client keeps retries bounded and data fresh.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME,
            gcTime: QUERY_CACHE_TIME,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}