"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  animate,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Motion vocabulary for the marketing surface.
 *
 * The register here is editorial, not promotional: slow, short travel, no
 * bounce, no glow. Type settles onto the page rather than flying in.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const VIEWPORT = { once: true, margin: "-90px" } as const;

/* =============================== Reveal ================================= */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* ============================= LineReveal =============================== */

/**
 * Display headline that rises line by line out of a clipping mask — the
 * standard editorial entrance, and the reason the serif lands as typography
 * rather than as an effect. Pass one array entry per visual line.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  animateOnScroll = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  animateOnScroll?: boolean;
}) {
  const trigger = animateOnScroll
    ? { whileInView: "visible" as const, viewport: VIEWPORT }
    : { animate: "visible" as const };

  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      {...trigger}
      variants={{
        visible: { transition: { staggerChildren: 0.11, delayChildren: delay } },
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block", lineClassName)}
            variants={{
              hidden: { y: "108%" },
              visible: { y: "0%", transition: { duration: 1.05, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ============================== CountUp ================================= */

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() => format(0, decimals));

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(format(to, decimals));
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v, decimals)),
    });
    return () => controls.stop();
  }, [inView, to, decimals, reduced]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function format(value: number, decimals: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ============================== Meter =================================== */

/**
 * Single-series magnitude bar (a confidence readout, not a chart).
 * Thin mark, rounded data-end on a recessive track, always direct-labeled so
 * the value never depends on colour alone.
 */
export function Meter({
  value,
  label,
  className,
  active = true,
}: {
  value: number;
  label?: string;
  className?: string;
  active?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1.5 flex items-baseline justify-between text-[11px]">
          <span className="uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className="font-semibold tabular-nums">{pct}%</span>
        </div>
      ) : null}
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? pct / 100 : 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
          style={{ originX: 0 }}
        />
      </div>
    </div>
  );
}

/* ============================ SectionLabel ============================== */

/** Small tracked label with a leading rule — the editorial section marker. */
export function SectionLabel({
  children,
  className,
  light = false,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em]",
        light ? "text-white/60" : "text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      {children}
    </span>
  );
}

/* ========================= useSectionScroll ============================= */

/**
 * Returns a scroll progress MotionValue (0–1) scoped to a specific section
 * element. Use `offset` to control when the animation starts and ends.
 */
export function useSectionScroll(
  ref: RefObject<HTMLElement | null>,
  offset: [string, string] = ["start end", "end start"],
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as Parameters<typeof useScroll>[0]["offset"],
  });
  return scrollYProgress;
}

/* ============================ ParallaxLayer ============================= */

/**
 * Wraps children with a scroll-driven vertical translation.
 * `outputRange` controls how far the layer moves across the scroll range.
 */
export function ParallaxLayer({
  children,
  className,
  progress,
  outputRange = [-60, 60],
}: {
  children: ReactNode;
  className?: string;
  progress: MotionValue<number>;
  outputRange?: [number, number];
}) {
  const y = useTransform(progress, [0, 1], outputRange);
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      style={reduced ? {} : { y }}
    >
      {children}
    </motion.div>
  );
}

/* ========================== HorizontalReveal ============================ */

/**
 * Slides content in from either side as scroll progresses.
 * Completes by `inputRange[1]` so content is readable when centered.
 */
export function HorizontalReveal({
  children,
  className,
  progress,
  from = "left",
  distance = 80,
  inputRange = [0, 0.45],
}: {
  children: ReactNode;
  className?: string;
  progress: MotionValue<number>;
  from?: "left" | "right";
  distance?: number;
  inputRange?: [number, number];
}) {
  const reduced = useReducedMotion();
  const xStart = from === "left" ? -distance : distance;
  const x = useTransform(progress, inputRange, [xStart, 0]);
  const opacity = useTransform(progress, inputRange, [0, 1]);

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      style={reduced ? {} : { x, opacity }}
    >
      {children}
    </motion.div>
  );
}

/* ========================= CurtainPanel ================================= */

/**
 * A foliage panel that slides horizontally away from the center as the user
 * scrolls into the section — the "curtain opening" effect.
 *
 * progress 0 = curtain closed, 1 = curtain fully open.
 */
export function CurtainPanel({
  children,
  className,
  progress,
  side,
  travelVw = 28,
  inputRange = [0, 0.6],
}: {
  children: ReactNode;
  className?: string;
  progress: MotionValue<number>;
  side: "left" | "right";
  travelVw?: number;
  inputRange?: [number, number];
}) {
  const reduced = useReducedMotion();
  const sign = side === "right" ? 1 : -1;
  const x = useTransform(progress, inputRange, [0, sign * travelVw], { clamp: true });
  const xPct = useTransform(x, (v) => `${v}vw`);
  const opacity = useTransform(progress, [0, 0.15, 0.75, 1], [0.9, 0.85, 0.35, 0.1]);

  return (
    <motion.div
      className={cn("pointer-events-none will-change-transform", className)}
      style={reduced ? {} : { x: xPct, opacity }}
    >
      {children}
    </motion.div>
  );
}

/* =========================== MotionProvider ============================= */

/**
 * The CSS guard in globals.css only neutralises CSS animations — Framer Motion
 * drives transforms from JS and sails straight past it. `reducedMotion="user"`
 * closes that hole for every motion component below this provider.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/* =========================== ScrollProgress ============================= */

/** Hairline reading-progress rail. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-primary/70"
    />
  );
}

export { motion, useScroll, useTransform, useSpring, useReducedMotion, useInView };
