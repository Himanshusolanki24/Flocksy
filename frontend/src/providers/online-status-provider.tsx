"use client";

import { useEffect, useState, createContext, useContext, type ReactNode } from "react";

type OnlineStatus = {
  isOnline: boolean;
};

const OnlineStatusContext = createContext<OnlineStatus>({ isOnline: true });

/**
 * Tracks browser connectivity and exposes it to UI (offline banner, etc.).
 */
export function OnlineStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(
    typeof window === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus(): OnlineStatus {
  return useContext(OnlineStatusContext);
}