# Hero Ink-Bloom Background Design

Date: 2026-07-12
Status: approved

## Problem

The client wants the hero background to evoke ink splashing into water and
spreading naturally. The hero currently has a drifting calligraphy-flourish
stroke (added the prior turn), which this replaces.

## Goal

A stylized ink-bloom background for the hero that suggests ink diffusing in
water, staying inside the quiet-luxury design system: Alabaster bg, Umber
accent, whisper-level opacity, no new dependencies.

## Decisions (from grill)

1. Fidelity: stylized bloom, not a real fluid simulation. On-brand, GPU-light,
   no new dependency.
2. Replaces the existing hero flourish. One background idea, not two.
3. Motion: continuous slow loop (perpetual spread/dissolve), not a one-time
   splash. Avoids the hero going static after load.
4. Color: umber at whisper opacity (~6%). Reads as faint warm smoke, never
   competes with the headline.
5. Tech: SVG `feTurbulence` + `feDisplacementMap` for organic ink edges
   (static filter), motion via cheap CSS transforms. Dependency-free.
6. Mobile: degrade to one static filtered bloom. Reduced-motion: same static
   fallback.

## Architecture

New self-contained component `src/components/HeroInkBloom.tsx`:

- Root: `absolute inset-0 -z-10 overflow-hidden`, `aria-hidden`,
  `pointer-events-none`.
- One inline `<svg>` defining a reusable filter in `<defs>`:
  `feTurbulence` (type `fractalNoise`, baseFrequency ~0.012, numOctaves 2)
  feeding `feDisplacementMap` (scale ~40). The filter is static; it is never
  animated (animating baseFrequency is CPU-murder).
- 3 bloom elements. Each is a div with:
  - a radial-gradient background, umber core fading to transparent
  - heavy blur (~40px) for soft diffusion
  - the shared displacement filter applied for irregular inky edges
  - one of three keyframe animations (see below)
- Umber core alpha tuned so the composited bloom sits around 6% visible
  strength against the alabaster background.

Bloom placement is weighted toward the headline's left/center region, echoing
where the flourish sat, so the hero keeps the same visual balance.

## Motion

Three CSS keyframe sets (`ink-bloom-a/b/c`), each combining:

- scale 1 → ~1.25 → 1 (the spread + settle)
- small translate drift (transform only)
- opacity fade in/out within the low whisper range (the dissolve)

Durations 18-28s, staggered delays, different transforms per bloom so the three
never pulse in sync and the overall field reads as continuous organic
diffusion. Transform/opacity only, `will-change: transform`, GPU-composited.

## Degrade

- `@media (max-width: 767px)`: bloom animations off; a single static filtered
  bloom remains for the vibe without filter-animation cost on phone GPUs.
- `@media (prefers-reduced-motion: reduce)`: animations off, same static
  fallback.

## Files touched

- new `src/components/HeroInkBloom.tsx`
- `src/components/Hero.tsx` — remove the flourish `<svg>` and its
  `animate-flourish` usage, render `<HeroInkBloom />` in its place
- `src/index.css` — add ink-bloom keyframes + mobile/reduced-motion gates;
  remove the now-unused `flourish-drift` keyframes and `.animate-flourish`

## Success criteria

- Hero background reads as ink slowly diffusing in water, at whisper strength,
  never reducing headline readability
- No layout shift; motion is transform/opacity only
- Mobile and reduced-motion get a clean static fallback, no jank
- No console errors, TypeScript clean, build passes
- The prior flourish is fully removed (no dead CSS/markup)
