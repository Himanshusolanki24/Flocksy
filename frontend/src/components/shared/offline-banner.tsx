"use client";

import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOnlineStatus } from "@/providers/online-status-provider";
import { AnimatePresence, motion } from "framer-motion";

/** Small, dismissable offline indicator shown when the connection drops. */
export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();
  const t = useTranslations("common");

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-warning/90 px-4 py-2 text-center text-sm font-medium text-warning-foreground backdrop-blur"
        >
          <WifiOff className="h-4 w-4" />
          {t("offlineMessage")}
        </motion.div>
      )}
    </AnimatePresence>
  );
}