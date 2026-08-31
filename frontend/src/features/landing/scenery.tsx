/**
 * Hand-crafted scenery for the marketing surface.
 *
 * All scenery is inline SVG — no image assets, no network requests, scales to
 * any viewport, and recolours from the paper palette. The grain filter keeps
 * gradients reading as paint rather than CSS.
 */

"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CurtainPanel, useSectionScroll, ParallaxLayer } from "./motion";

/* ============================== Grain =================================== */

/**
 * Shared paper-grain filter. feTurbulence is expensive so it renders once
 * on a flat rect per scene rather than over the full artwork.
 */
export function GrainDefs({ id }: { id: string }) {
  return (
    <filter id={id} x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  );
}

/* ============================== Sky ===================================== */

/**
 * Soft dawn sky with drifting cloud banks — sits behind the hero and feature
 * sections. Purely decorative.
 */
export function SkyBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8d8d2" />
            <stop offset="35%" stopColor="#dde8e2" />
            <stop offset="70%" stopColor="#e8ede6" />
            <stop offset="100%" stopColor="#f2efe5" />
          </linearGradient>
          <radialGradient id="sun-glow" cx="50%" cy="16%" r="50%">
            <stop offset="0%" stopColor="#f5e6c0" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f0ddb0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f5e6c0" stopOpacity="0" />
          </radialGradient>
          {/* Atmospheric horizon haze */}
          <linearGradient id="horizon-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8f0eb" stopOpacity="0" />
            <stop offset="100%" stopColor="#e8f0eb" stopOpacity="0.6" />
          </linearGradient>
          <GrainDefs id="sky-grain" />
        </defs>

        <rect width="1440" height="900" fill="url(#sky-grad)" />
        <rect width="1440" height="900" fill="url(#sun-glow)" />

        {/* Distant hills silhouette */}
        <path
          d="M0 560 Q200 480 400 510 Q600 540 720 490 Q840 440 1040 500 Q1200 540 1440 480 L1440 900 L0 900 Z"
          fill="#c5d5c8"
          opacity="0.35"
        />
        <path
          d="M0 600 Q180 540 360 560 Q540 580 720 545 Q900 510 1080 555 Q1260 590 1440 550 L1440 900 L0 900 Z"
          fill="#b8ccbd"
          opacity="0.28"
        />

        {/* Ground plane with soft gradient */}
        <rect x="0" y="700" width="1440" height="200" fill="#d4e2d0" opacity="0.45" />

        {/* Cloud banks — three drifting layers at different speeds */}
        <g className="cloud-drift-slow" opacity="0.45">
          <ellipse cx="240" cy="160" rx="280" ry="55" fill="#ffffff" opacity="0.5" />
          <ellipse cx="390" cy="190" rx="210" ry="42" fill="#ffffff" opacity="0.35" />
        </g>
        <g className="cloud-drift" opacity="0.4">
          <ellipse cx="1120" cy="130" rx="310" ry="52" fill="#ffffff" opacity="0.45" />
          <ellipse cx="970" cy="165" rx="200" ry="38" fill="#ffffff" opacity="0.3" />
        </g>
        <g className="cloud-drift-fast" opacity="0.3">
          <ellipse cx="700" cy="280" rx="380" ry="48" fill="#ffffff" opacity="0.35" />
        </g>

        <rect width="1440" height="900" fill="url(#horizon-haze)" />
        <rect width="1440" height="900" filter="url(#sky-grain)" opacity="0.04" />
      </svg>
    </div>
  );
}

/* ============================== Foliage ================================= */

/**
 * Static leafy branch for the hero corners (desktop only).
 * The scroll-driven curtain version is ForestCurtain below.
 */
export function FoliageCorner({
  side = "left",
  className = "",
}: {
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute top-0 ${
        side === "left" ? "left-0" : "right-0 -scale-x-100"
      } ${className}`}
      aria-hidden
    >
      <svg width="460" height="520" viewBox="0 0 460 520" fill="none" role="presentation">
        <defs>
          <linearGradient id={`leaf-${side}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2d4332" />
            <stop offset="50%" stopColor="#3f5c47" />
            <stop offset="100%" stopColor="#5c7c68" />
          </linearGradient>
          <linearGradient id={`bark-${side}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a3428" />
            <stop offset="100%" stopColor="#3d4f3a" />
          </linearGradient>
        </defs>

        {/* Main trunk */}
        <path
          d="M-20 -10 C 80 50, 140 130, 175 240 C 195 295, 212 360, 238 420"
          stroke="url(#bark-left)"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Secondary branch */}
        <path
          d="M35 -10 C 85 75, 65 160, 32 255"
          stroke="url(#bark-left)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* Tertiary branch */}
        <path
          d="M90 60 C 140 80, 180 100, 200 140"
          stroke="url(#bark-left)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Leaves — hand-placed for natural spread */}
        {LEAVES.map(({ x, y, r, s, o }, i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
            <path
              d="M0 0 C 30 -24, 70 -16, 82 8 C 70 30, 30 36, 0 0 Z"
              fill={`url(#leaf-${side})`}
            />
            <path d="M2 1 C 28 3, 58 6, 80 8" stroke="#1e2e20" strokeWidth="1.2" opacity="0.4" />
          </g>
        ))}

        {/* Small blossoms for warmth */}
        {[
          [155, 130],
          [100, 218],
          [218, 308],
          [76, 355],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="6" fill="#f4ede0" opacity="0.85" />
        ))}
      </svg>
    </div>
  );
}

const LEAVES: { x: number; y: number; r: number; s: number; o: number }[] = [
  { x: 18, y: 28, r: 22, s: 1.15, o: 0.95 },
  { x: 68, y: 8, r: -18, s: 0.92, o: 0.88 },
  { x: 115, y: 75, r: 48, s: 1.05, o: 0.92 },
  { x: 52, y: 128, r: -42, s: 0.88, o: 0.82 },
  { x: 155, y: 158, r: 22, s: 1.08, o: 0.94 },
  { x: 98, y: 225, r: -58, s: 0.82, o: 0.78 },
  { x: 188, y: 248, r: 38, s: 0.98, o: 0.9 },
  { x: 132, y: 302, r: -28, s: 0.78, o: 0.72 },
  { x: 218, y: 352, r: 58, s: 0.88, o: 0.82 },
  { x: 178, y: 28, r: 72, s: 0.72, o: 0.62 },
  { x: 242, y: 192, r: -12, s: 0.72, o: 0.68 },
  { x: 28, y: 195, r: 30, s: 0.75, o: 0.7 },
  { x: 162, y: 418, r: -35, s: 0.65, o: 0.6 },
];

/* ============================ ForestCurtain ============================= */

/**
 * The cinematic scroll curtain. Two tree panels (left + right) slide away
 * horizontally as the user scrolls into the parent section, revealing the
 * content behind like stage curtains parting.
 *
 * Each panel has foreground and midground layers moving at different speeds
 * to create parallax depth. A subtle hen silhouette appears in the midground.
 *
 * Usage: wrap the section and pass `sectionRef` pointing to the section element.
 */
export function ForestCurtain({
  sectionRef,
  className,
  withHens = false,
  travelVw = 28,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
  withHens?: boolean;
  travelVw?: number;
}) {
  const progress = useSectionScroll(sectionRef, ["start 85%", "center center"]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* LEFT PANEL */}
      <CurtainPanel
        progress={progress}
        side="left"
        travelVw={travelVw}
        className="absolute inset-y-0 left-0 w-[42%]"
      >
        <TreeCluster side="left" withHens={withHens} />
      </CurtainPanel>

      {/* RIGHT PANEL */}
      <CurtainPanel
        progress={progress}
        side="right"
        travelVw={travelVw}
        className="absolute inset-y-0 right-0 w-[42%] -scale-x-100"
      >
        <TreeCluster side="right" withHens={false} />
      </CurtainPanel>

      {/* Ground atmosphere — stays fixed */}
      <GroundAtmosphere />
    </div>
  );
}

/* ============================ TreeCluster =============================== */

function TreeCluster({
  side,
  withHens,
}: {
  side: "left" | "right";
  withHens: boolean;
}) {
  const gradId = `tree-${side}`;
  const barkId = `bark-tree-${side}`;
  const leafBgId = `leaf-bg-${side}`;

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 560 900"
      preserveAspectRatio="xMaxYMid meet"
      role="presentation"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e2e21" />
          <stop offset="40%" stopColor="#2d4332" />
          <stop offset="100%" stopColor="#4a6852" />
        </linearGradient>
        <linearGradient id={`${gradId}-light`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3f5c47" />
          <stop offset="100%" stopColor="#5c7c68" />
        </linearGradient>
        <linearGradient id={barkId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e2820" />
          <stop offset="100%" stopColor="#2e3d2c" />
        </linearGradient>
        <linearGradient id={leafBgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#243828" />
          <stop offset="100%" stopColor="#3d5545" />
        </linearGradient>
        {/* Edge fade so the panel blends into the page */}
        <linearGradient id={`fade-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f2efe5" stopOpacity="0" />
          <stop offset="100%" stopColor="#f2efe5" stopOpacity="0" />
        </linearGradient>
        <GrainDefs id={`grain-${side}`} />
      </defs>

      {/* ---- BACKGROUND TREES (far, misty) ---- */}
      <g opacity="0.35">
        <path d="M420 900 L420 420 L480 300 L540 420 L540 900 Z" fill={`url(#${leafBgId})`} />
        <ellipse cx="480" cy="280" rx="80" ry="120" fill={`url(#${leafBgId})`} />
        <path d="M350 900 L350 500 L400 380 L450 500 L450 900 Z" fill={`url(#${leafBgId})`} />
        <ellipse cx="400" cy="360" rx="65" ry="100" fill={`url(#${leafBgId})`} />
      </g>

      {/* ---- MIDGROUND TREES ---- */}
      <g opacity="0.72">
        {/* Tree 1 — main tall */}
        <rect x="270" y="500" width="18" height="400" fill={`url(#${barkId})`} rx="4" />
        <path
          d="M279 520 C 279 380, 230 260, 200 200 C 200 200, 279 240, 279 200 C 279 240, 358 200, 358 200 C 328 260, 279 380, 279 520 Z"
          fill={`url(#${gradId})`}
        />
        <ellipse cx="279" cy="195" rx="82" ry="140" fill={`url(#${gradId})`} />

        {/* Tree 2 — secondary */}
        <rect x="175" y="580" width="13" height="320" fill={`url(#${barkId})`} rx="3" />
        <ellipse cx="181" cy="390" rx="60" ry="115" fill={`url(#${gradId})`} />

        {/* Tree 3 — leaning foreground trunk */}
        <path
          d="M100 900 C 105 700, 115 550, 138 440"
          stroke={`url(#${barkId})`}
          strokeWidth="20"
          strokeLinecap="round"
        />
        <ellipse cx="148" cy="380" rx="72" ry="110" fill={`url(#${gradId})`} />
      </g>

      {/* ---- FOREGROUND FOLIAGE (closest, richest) ---- */}
      <g opacity="0.88">
        {/* Dense foreground bush/canopy */}
        <ellipse cx="80" cy="580" rx="120" ry="90" fill={`url(#${gradId})`} />
        <ellipse cx="160" cy="620" rx="100" ry="75" fill={`url(#${gradId})`} />
        <ellipse cx="40" cy="640" rx="80" ry="65" fill={`url(#${gradId})`} />

        {/* Foreground branches hanging from top */}
        <path
          d="M0 0 C 40 60, 80 100, 120 180 C 140 220, 155 280, 145 350"
          stroke={`url(#${barkId})`}
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M-10 0 C 20 40, 50 80, 30 160"
          stroke={`url(#${barkId})`}
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Hanging leaves along top branch */}
        {BRANCH_LEAVES.map(({ x, y, r, s, o }, i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
            <path
              d="M0 0 C 28 -22, 65 -14, 76 8 C 65 28, 28 34, 0 0 Z"
              fill={`url(#${gradId})`}
            />
            <path d="M1 1 C 25 3, 52 6, 74 8" stroke="#1a2b1c" strokeWidth="1.1" opacity="0.38" />
          </g>
        ))}

        {/* Ground-level grass tufts */}
        {[40, 80, 130, 180, 220, 280].map((x, i) => (
          <g key={i} transform={`translate(${x} 870)`}>
            <path d="M0 0 C -8 -35, -4 -55, 0 -70 C 4 -55, 8 -35, 0 0 Z" fill="#2d4332" opacity="0.7" />
            <path d="M10 0 C 2 -28, 6 -45, 10 -58 C 14 -45, 18 -28, 10 0 Z" fill="#3a5040" opacity="0.6" />
          </g>
        ))}
      </g>

      {/* Hen silhouettes in midground */}
      {withHens && <HenSilhouettes />}

      {/* Grain texture */}
      <rect width="560" height="900" filter={`url(#grain-${side})`} opacity="0.04" />
    </svg>
  );
}

/* ============================== Hens =================================== */

/** Sophisticated hen silhouettes — editorial, not cartoon */
function HenSilhouettes() {
  return (
    <g opacity="0.55">
      {/* Hen 1 — pecking down */}
      <g transform="translate(200 760) scale(1.4)">
        <HenShape />
      </g>
      {/* Hen 2 — standing alert */}
      <g transform="translate(240 770) scale(1.1)">
        <HenShape alert />
      </g>
    </g>
  );
}

function HenShape({ alert = false }: { alert?: boolean }) {
  return (
    <g fill="#1e2820">
      {/* Body */}
      <ellipse cx="0" cy="0" rx="18" ry="12" />
      {/* Head */}
      <circle cx={alert ? 16 : 14} cy={alert ? -14 : -8} r="7" />
      {/* Beak */}
      <path d={alert ? "M22 -15 L28 -13 L22 -11 Z" : "M20 -8 L26 -6 L20 -4 Z"} />
      {/* Tail feathers */}
      <path d="M-16 -4 C -26 -12, -30 -4, -24 2 Z" />
      {/* Legs */}
      <path d="M4 10 L2 24 M-4 10 L-6 24" stroke="#1e2820" strokeWidth="2" />
    </g>
  );
}

/* ============================ Ground Atmosphere ========================= */

function GroundAtmosphere() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none">
      <svg className="h-full w-full" viewBox="0 0 1440 160" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id="ground-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4e2d0" stopOpacity="0" />
            <stop offset="100%" stopColor="#c8d8c4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="1440" height="160" fill="url(#ground-fade)" />
        {/* Subtle grass line */}
        <path
          d="M0 100 Q360 88 720 95 Q1080 102 1440 90"
          stroke="#8aab8e"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

/* ====================== BRANCH_LEAVES data ============================ */

const BRANCH_LEAVES: { x: number; y: number; r: number; s: number; o: number }[] = [
  { x: 15, y: 40, r: 35, s: 1.2, o: 0.9 },
  { x: 42, y: 72, r: 58, s: 1.0, o: 0.85 },
  { x: 78, y: 108, r: 42, s: 1.1, o: 0.92 },
  { x: 110, y: 150, r: 22, s: 0.95, o: 0.88 },
  { x: 130, y: 195, r: 65, s: 0.85, o: 0.8 },
  { x: 142, y: 248, r: 30, s: 0.9, o: 0.82 },
  { x: 30, y: 110, r: -20, s: 0.8, o: 0.75 },
  { x: 65, y: 165, r: 50, s: 0.88, o: 0.78 },
  { x: 155, y: 320, r: 40, s: 0.75, o: 0.65 },
];

/* ====================== ElegantDivider ================================= */

/**
 * Subtle botanical SVG divider between sections — a horizontal branch/vine
 * motif that reads as editorial design rather than decoration.
 */
export function ElegantDivider({ className = "" }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none mx-auto flex justify-center py-8", className)} aria-hidden>
      <svg width="320" height="32" viewBox="0 0 320 32" fill="none" role="presentation">
        <path d="M0 16 Q80 16 148 16" stroke="#8aab8e" strokeWidth="1" opacity="0.5" />
        <path d="M172 16 Q240 16 320 16" stroke="#8aab8e" strokeWidth="1" opacity="0.5" />
        {/* Center botanical mark */}
        <g transform="translate(160 16)">
          <circle r="3" fill="#5c7c68" opacity="0.6" />
          <path d="M-8 0 C -8 -8, -2 -12, 0 -8 C 2 -12, 8 -8, 8 0 C 8 8, 2 12, 0 8 C -2 12, -8 8, -8 0 Z"
            fill="none" stroke="#5c7c68" strokeWidth="1" opacity="0.5" />
        </g>
        {/* Small leaves along the branch */}
        <g transform="translate(60 16) rotate(-30)">
          <path d="M0 0 C 6 -5, 14 -3, 16 2 C 14 7, 6 9, 0 0 Z" fill="#5c7c68" opacity="0.35" />
        </g>
        <g transform="translate(260 16) rotate(150)">
          <path d="M0 0 C 6 -5, 14 -3, 16 2 C 14 7, 6 9, 0 0 Z" fill="#5c7c68" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
