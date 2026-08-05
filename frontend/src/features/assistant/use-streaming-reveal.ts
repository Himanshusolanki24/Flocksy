"use client";

import { useEffect, useState } from "react";

/**
 * Reveals `fullText` progressively — drives the "streaming" feel and
 * supports token-by-token display without a real SSE backend.
 */
export function useStreamingReveal(
  fullText: string,
  speed = 8, // chars per tick
  tickMs = 24,
): string {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!fullText) return;
    const chunk = Math.max(1, speed);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= fullText.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + chunk;
      });
    }, tickMs);
    return () => clearInterval(timer);
  }, [fullText, speed, tickMs]);

  return fullText.slice(0, count);
}