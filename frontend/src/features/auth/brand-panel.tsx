"use client";

import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/shared/brand";
import { cn } from "@/lib/utils";

/**
 * Left-hand storytelling panel: an inline SVG of an Indian poultry farm at
 * first light. Inline on purpose — no image request, no layout shift, and it
 * stays crisp on the low-end Android screens most farmers use.
 */
export function BrandPanel({ className }: { className?: string }) {
  const t = useTranslations("auth");

  return (
    <aside
      className={cn(
        "relative isolate hidden overflow-hidden bg-[#f4f1e8] lg:flex lg:flex-col",
        className,
      )}
    >
      <FarmScene className="absolute inset-0 h-full w-full object-cover" />

      {/* Warm scrim so the copy stays readable over the scene. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0d2a1c]/85 via-[#0d2a1c]/25 to-transparent"
        aria-hidden
      />

      <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div className="leading-tight">
            <p className="text-lg font-semibold tracking-tight text-white">
              Flocksy
            </p>
            <p className="text-xs text-white/70">{t("brandTagline")}</p>
          </div>
        </div>

        <div className="max-w-sm">
          <h2 className="text-balance text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-[2.75rem]">
            {t("panelLine1")}
            <br />
            {t("panelLine2")}
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-white/80">
            {t("panelSub")}
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Compact version shown above the form on mobile. */
export function FarmStrip() {
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-[#f4f1e8] sm:h-32">
      <FarmScene className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}

function FarmScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      role="img"
      aria-label="A poultry farm at sunrise"
    >
      <defs>
        <linearGradient id="fp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e8cf" />
          <stop offset="55%" stopColor="#f7dfc0" />
          <stop offset="100%" stopColor="#f3ead6" />
        </linearGradient>
        <linearGradient id="fp-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f7d4f" />
          <stop offset="100%" stopColor="#1e4c31" />
        </linearGradient>
        <radialGradient id="fp-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffdca6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffdca6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill="url(#fp-sky)" />
      <circle cx="600" cy="215" r="160" fill="url(#fp-sun)" />
      <circle cx="600" cy="215" r="46" fill="#ffcf87" />

      {/* Distant treeline */}
      <g fill="#c9d6bb">
        <path d="M0 330h800v20H0z" />
        {[40, 110, 175, 250, 330, 415, 500, 585, 665, 745].map((x, i) => (
          <ellipse
            key={x}
            cx={x}
            cy={326}
            rx={34 + (i % 3) * 8}
            ry={22 + (i % 2) * 8}
          />
        ))}
      </g>

      {/* Mid field */}
      <path d="M0 350h800v90H0z" fill="#8fae7c" />
      <path
        d="M0 396c140-24 260 16 400 4s260-30 400-12v212H0z"
        fill="url(#fp-field)"
      />

      {/* Poultry shed */}
      <g>
        <path d="M196 300l124-52 124 52v14H196z" fill="#9a5b3d" />
        <rect x="212" y="314" width="216" height="106" rx="6" fill="#f0e6d2" />
        <rect
          x="212"
          y="314"
          width="216"
          height="106"
          rx="6"
          fill="none"
          stroke="#d8c9ad"
          strokeWidth="3"
        />
        {[240, 286, 332, 378].map((x) => (
          <rect
            key={x}
            x={x}
            y={340}
            width="30"
            height="34"
            rx="4"
            fill="#2f5d3f"
            opacity="0.75"
          />
        ))}
        <rect x="212" y="414" width="216" height="10" fill="#d8c9ad" />
      </g>

      {/* Farmer silhouette carrying a feed bucket */}
      <g fill="#123a26">
        <circle cx="560" cy="404" r="12" />
        <path d="M548 422h24l8 52h-14l-4-26-4 26h-14z" />
        <path d="M572 428l18 12-4 8-18-10z" />
        <rect x="586" y="446" width="18" height="16" rx="3" />
      </g>

      {/* Hens */}
      <g fill="#173f29">
        {[
          { x: 300, y: 470, s: 1 },
          { x: 360, y: 496, s: 1.15 },
          { x: 234, y: 505, s: 0.95 },
          { x: 430, y: 462, s: 0.85 },
        ].map(({ x, y, s }) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
            <ellipse cx="0" cy="0" rx="22" ry="15" />
            <circle cx="17" cy="-13" r="8" />
            <path d="M17 -22c4-6 9-5 8 1-3-2-5-1-8-1z" />
            <path d="M25 -13l8 3-8 3z" fill="#e0a34a" />
            <path d="M-6 14l-3 12h4l5-10zM6 14l3 12h-4l-5-10z" />
            <path d="M-22 -2c-8-6-14-2-12 4 4-1 8-1 12-4z" />
          </g>
        ))}
      </g>

      {/* Foreground grass */}
      <path d="M0 540c120-18 220 10 340 2s220-26 460-10v68H0z" fill="#123a26" />
    </svg>
  );
}
