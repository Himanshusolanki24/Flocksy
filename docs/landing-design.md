# Flocksy Landing Page — Design Spec

The marketing surface (`/[locale]` — the `(marketing)` route group) is designed
as a warm editorial page, not a SaaS gradient template. This document records
the decisions so the look survives future edits.

**Reference:** [vestris.ai](https://vestris.ai) — chosen by the project owner.
Its tokens were read from the live site rather than eyeballed. Its *artwork* was
not copied; Flocksy draws its own.

---

## 1. Palette

Scoped to the `.paper` class in `src/app/globals.css`. It re-points the same
token names the rest of the app uses (`--background`, `--primary`, `--border`…),
so every Tailwind utility retargets automatically and **the in-app UI is
untouched**.

| Token | Value | Role |
|---|---|---|
| `--background` | `#f2efe5` | Bone paper. Never white. |
| `--card` | `#fdfbf5` | Panels, floating cards |
| `--foreground` | `#2b2927` | Warm charcoal ink |
| `--muted-foreground` | `#6d6863` | Body copy |
| `--secondary` / `--muted` | `#e7e1ce` / `#ebe4d7` | Chat bubbles, tints |
| `--border` | `#e0d8c7` | Hairlines — the main separator |
| `--primary` | `#5c7c68` | Sage. The only saturated colour. |
| `--harvest` | `#b8622f` | Terracotta. Used once or twice. |
| `--ink` | `#233426` | Deep forest, for the one inverted section |

`#f2efe5`, `#5c7c68` and `#2b2927` are the reference's literal values
(`body { background: rgb(242, 239, 229) }`).

### Contrast — measured, not guessed

| Pair | Ratio | Verdict |
|---|---|---|
| `foreground` on paper | 12.60 | AAA |
| `muted-foreground` on paper | 4.79 | AA |
| `primary` on paper | 4.02 | AA-large only |
| `ink-foreground` on ink | 11.03 | AAA |

The reference ships `#736e6a` for body copy, which measures **4.38 and fails
AA**. Flocksy uses `#6d6863` instead. Sage is AA-large only, so `text-primary`
is restricted to display type (headline italic, `01/02/03` numerals, the big
figure). Never use it for small text — the confidence meter's 11px label
deliberately renders in muted ink while only the bar is sage.

### Light only, on purpose

There is no `.dark .paper`. The reference has no dark mode and a dark cream
palette reads as mud. The theme toggle is removed from the marketing nav.
`.paper` sits below `.dark` in the tree, so its tokens win regardless of the
user's app-wide theme.

---

## 2. Typography

| Face | Loaded as | Used for |
|---|---|---|
| **Playfair Display** (400/500/600, roman + italic) | `--font-display` | Every headline, the big figures, the diagnosis name |
| **Geist** | `--font-sans` | All body, UI, labels |
| **Noto Sans Devanagari** | fallback in both stacks | Guarantees Hindi renders |

Loaded once in `src/lib/fonts.ts` via `next/font/google`.

Rules:

- Headlines pair **roman + italic on separate lines** — `Your farm,` / *`made
  intelligent.`* The italic line takes `text-primary`. This is the reference's
  signature move.
- Section labels are 11px, uppercase, `tracking-[0.18em]`, preceded by a short
  rule (`<SectionLabel>`).
- Body copy sits at `leading-relaxed` in `muted-foreground`.

Playfair replaced Instrument Serif, which rendered too thin and low-contrast at
display sizes.

---

## 3. Page structure

| # | Section | Notes |
|---|---|---|
| 1 | **Hero** | Centred. Sky backdrop + foliage in both corners. Kicker → headline → sub → two CTAs. |
| 2 | **Product window** | Same section, same sky — the app frame floats on the scene rather than on a new flat band. |
| 3 | **Trust row** | Partner names, small and muted, between hairlines. |
| 4 | **Steps `01–03`** | Centred heading. Rows separated by rules: numeral, serif title, copy + two dashed bullets. |
| 5 | **Capabilities** | Six cards floating over a second sky, `bg-card/85` + backdrop blur, lift on hover. |
| 6 | **Safety** | The page's only inverted ground (`bg-ink`). Roman/italic headline. |
| 7 | **Impact** | One large sage figure + a 2×2 grid of counted figures. |
| 8 | **Voices** | Three quotes set in the display serif on hairlines. No cards, no stars. |
| 9 | **FAQ** | Two-column: heading left, accordion right. |
| 10 | **Final CTA** | Centred serif statement, one button. |
| 11 | **Footer** | Painted farm banner (a real image, not SVG) dissolving into ink; links reversed out in white. |

Sections are separated by **1px rules and whitespace**, not boxes and shadows.

---

## 4. Artwork (`scenery.tsx`)

All inline SVG. No image assets, no network requests, scales to any viewport,
recolours from the palette.

- **`<SkyBackdrop>`** — dawn gradient, sun glow, three cloud banks drifting at
  different speeds (`cloud-drift`, `-slow`, `-fast`; 62s–150s, alternating).
- **`<FoliageCorner side>`** — a leafy bough hanging into a corner. Leaf
  positions are hand-placed in the `LEAVES` array so it reads as drawn rather
  than tiled. `-scale-x-100` mirrors it for the right side.
- **The footer painting** — `public/images/flocksy_pastoral_footer_*.jpg`, the
  one raster asset on the page, served through `next/image` (1 MB source → ~180
  KB AVIF/WebP). The band carries the file's own `1376/768` ratio, so
  `object-cover` has nothing to crop and every viewport gets the entire scene,
  sky included. It has **no edges**: a radial mask anchored at the bottom
  (`radial-gradient(132% 97% at 50% 100%, …)`) feathers the image out toward
  the top, and further at the corners — that taper *is* the arc. The fade must
  reach zero before the element's top edge, or the mask just draws a softer
  straight line; a `border-radius` clip was the first attempt and only traded a
  straight cut for a curved one. Paper sits on the band's wrapper, not the
  footer, since whatever is behind shows through wherever the mask thins. From `lg` up the footer content floats on the painting's lower
  half; below that the stacked columns are taller than the painting, so they
  flow onto the `#141f17` ground instead.

  The scrim rides the **content block**, not a fraction of the band — anchored
  in px from where the type starts (transparent → 0.90 by 152 px). A
  percentage-height scrim guesses where the text will be and guessed wrong at
  both 1440 and 390. Measured on the rendered pixels: links 11.7, section
  labels 6.5, both AA. This replaced an inline `<FarmLandscape>` SVG.

Illustration is Flocksy's own — a farm, not the reference's house. Do not copy
the reference's assets.

---

## 5. Motion

Editorial register: slow, short travel, **no bounce, no glow, no springs**.

| Primitive | Behaviour |
|---|---|
| `fadeUp` | opacity + 18px, 0.85s, ease `[0.16, 1, 0.3, 1]` |
| `<LineReveal>` | Headline lines rise out of a clipping mask, 1.05s, staggered 0.11s |
| `<Reveal>` | Scroll-triggered `fadeUp`, fires once at `-90px` |
| `<CountUp>` | Figures count on entry, 1.8s |
| `<Meter>` | `scaleX` from a left origin |
| `<ScrollProgress>` | Hairline sage rail, spring-smoothed |

Only `transform` and `opacity` are animated.

### Accessibility

`<MotionProvider>` wraps the layout with `MotionConfig reducedMotion="user"`.
This matters: the CSS guard in `globals.css` only neutralises *CSS* animations,
and Framer Motion drives transforms from JS straight past it.

Framer also server-renders its `initial` state as inline styles, so every reveal
ships hidden and unhides on hydration. A `@media (scripting: none)` block
force-unhides them, otherwise the page is permanently blank without JS.

---

## 6. Files

```
src/app/globals.css                      .paper palette, keyframes, utilities
src/lib/fonts.ts                         Playfair + Geist + Devanagari
src/app/[locale]/(marketing)/layout.tsx  .paper wrapper, MotionProvider, nav/footer
src/features/landing/
  landing-page.tsx                       all ten body sections
  hero-chat.tsx                          the self-playing product demo
  scenery.tsx                            sky, foliage, grain
  motion.tsx                             motion vocabulary + Meter + SectionLabel
  marketing-nav.tsx                      sticky nav (no theme toggle)
  marketing-footer.tsx                   landscape footer
messages/{en,hi}.json                    landing.* keys — 113 each, full parity
public/images/flocksy_pastoral_footer_*.jpg  the footer painting
```

---

## 7. The product demo

`hero-chat.tsx` plays a scripted transcript on a loop: a Hindi question with a
photo → ranked diagnosis with a confidence meter → vet handoff. The photo is
real (`public/images/demo-hen.jpg`, a hen cropped out of the footer painting so
the page stays one illustration) — an empty grey rectangle made the demo read
as a wireframe of the product rather than the product. **The assistant
answers in Hindi**, on both locales — it is a picture of what the farmer sees,
and a Hindi question answered in English would be a picture of a different
product. The diagnosis keeps a small Latin gloss under the Devanagari, because
that is what the medicine label says. Beside it, an
**evidence rail** lists what the orchestrator consulted (vision model, symptom
agent, environment, farm memory, safety gate).

That rail is the point. For a diagnosis product, showing the trace is what earns
belief — and it maps to real architecture: `safety_agent.py:20` genuinely
returns `allow` / `allow_with_warning` / `block_and_escalate`.

The loop pauses via `useInView` when scrolled away (no background timers) and
collapses to a static transcript under reduced motion.

---

## 8. Rules for future edits

1. Never introduce white (`#fff`) as a surface. The ground is `#f2efe5`.
2. Sage is the only saturated colour, and only ever at display size.
3. Separate sections with rules and space — not shadows, not boxes.
4. Headlines are Playfair, roman + italic, centred.
5. No dark mode on this surface.
6. Run the contrast check before changing any ink token.
7. Keep every animation to `transform` and `opacity`.

## 9. Open items

- The footer was checked at 1440 and 390 px (measured contrast: link text 10.4,
  section labels 6.7 — both AA). The foliage corners and the evidence rail still
  need a look at mobile widths.
- Partner names in the trust row are placeholders.
- Figures (25,000 farms, 3M birds, 96%) are marketing placeholders, not measured.
