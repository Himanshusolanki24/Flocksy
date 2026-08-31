/**
 * Hand-drawn scenery for the marketing surface.
 *
 * All of it is inline SVG — no image assets, no network requests, scales to any
 * viewport, and recolours from the paper palette. The grain filter is what
 * stops the gradients reading as "CSS gradient" and makes them read as paint.
 */

/* ============================== Grain =================================== */

/**
 * Shared paper-grain filter. Rendered once, referenced by every scene.
 * feTurbulence is expensive to rasterise, so it runs on one flat rect per
 * scene rather than over the artwork itself.
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
 * Soft dawn sky with drifting cloud banks — sits behind the hero and the
 * feature cards. Purely decorative.
 */
export function SkyBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfe7e4" />
            <stop offset="45%" stopColor="#ecece1" />
            <stop offset="100%" stopColor="#f2efe5" />
          </linearGradient>
          <radialGradient id="sun-glow" cx="50%" cy="18%" r="45%">
            <stop offset="0%" stopColor="#f6e9cf" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f6e9cf" stopOpacity="0" />
          </radialGradient>
          <GrainDefs id="sky-grain" />
        </defs>

        <rect width="1440" height="900" fill="url(#sky-grad)" />
        <rect width="1440" height="900" fill="url(#sun-glow)" />

        {/* cloud banks — three drifting layers at different speeds */}
        <g className="cloud-drift-slow" opacity="0.5">
          <ellipse cx="240" cy="180" rx="260" ry="62" fill="#ffffff" opacity="0.55" />
          <ellipse cx="380" cy="210" rx="200" ry="48" fill="#ffffff" opacity="0.4" />
        </g>
        <g className="cloud-drift" opacity="0.45">
          <ellipse cx="1120" cy="140" rx="300" ry="58" fill="#ffffff" opacity="0.5" />
          <ellipse cx="980" cy="176" rx="190" ry="42" fill="#ffffff" opacity="0.35" />
        </g>
        <g className="cloud-drift-fast" opacity="0.35">
          <ellipse cx="700" cy="300" rx="360" ry="52" fill="#ffffff" opacity="0.4" />
        </g>

        <rect width="1440" height="900" filter="url(#sky-grain)" opacity="0.05" />
      </svg>
    </div>
  );
}

/* ============================== Foliage ================================= */

/**
 * Leafy branch that hangs into a corner, the way the reference frames its
 * hero. `side` mirrors it; scale it down on small screens via className.
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
      className={`pointer-events-none absolute top-0 ${side === "left" ? "left-0" : "right-0 -scale-x-100"} ${className}`}
      aria-hidden
    >
      <svg width="420" height="460" viewBox="0 0 420 460" fill="none" role="presentation">
        <defs>
          <linearGradient id={`leaf-${side}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f5c47" />
            <stop offset="100%" stopColor="#5c7c68" />
          </linearGradient>
        </defs>

        {/* main bough */}
        <path
          d="M-20 -10 C 90 40, 150 120, 190 230 C 210 285, 225 340, 250 400"
          stroke="#3a4a3c"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M40 -10 C 90 70, 70 150, 40 240"
          stroke="#3a4a3c"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* leaves — one shape, repeated at varied angles */}
        {LEAVES.map(({ x, y, r, s, o }, i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
            <path
              d="M0 0 C 26 -20, 62 -14, 74 6 C 62 26, 26 32, 0 0 Z"
              fill={`url(#leaf-${side})`}
            />
            <path d="M2 1 C 26 2, 52 5, 72 6" stroke="#2c3f33" strokeWidth="1.4" opacity="0.45" />
          </g>
        ))}

        {/* blossoms, for the warm accent */}
        {[
          [150, 120],
          [96, 210],
          [212, 300],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" fill="#f4ede0" opacity="0.9" />
        ))}
      </svg>
    </div>
  );
}

/** x, y, rotation, scale, opacity — hand-placed so it reads as drawn, not tiled. */
const LEAVES: { x: number; y: number; r: number; s: number; o: number }[] = [
  { x: 20, y: 30, r: 25, s: 1.1, o: 0.95 },
  { x: 70, y: 10, r: -15, s: 0.9, o: 0.85 },
  { x: 110, y: 80, r: 45, s: 1, o: 0.9 },
  { x: 55, y: 130, r: -40, s: 0.85, o: 0.8 },
  { x: 150, y: 160, r: 20, s: 1.05, o: 0.92 },
  { x: 100, y: 220, r: -55, s: 0.8, o: 0.75 },
  { x: 185, y: 250, r: 35, s: 0.95, o: 0.88 },
  { x: 130, y: 300, r: -25, s: 0.75, o: 0.7 },
  { x: 215, y: 350, r: 55, s: 0.85, o: 0.8 },
  { x: 175, y: 30, r: 70, s: 0.7, o: 0.6 },
  { x: 240, y: 190, r: -10, s: 0.7, o: 0.65 },
];
