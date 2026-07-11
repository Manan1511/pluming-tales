# Hero Flare Design

Date: 2026-07-12
Status: approved (approach A)

## Problem

Client finds the landing page dull. The hero renders fully static: no entry
motion, no depth, no life. The rest of the site already has restrained motion
(scroll reveals, image hover scales, gallery marquee), so the hero is the
flattest moment on the page despite being the first impression.

## Goal

Add whisper-level flare to the hero only, staying inside the existing design
system: Cormorant Garamond, Alabaster/Oatmere/Umber/Onyx palette, hairline
motifs, `cubic-bezier(0.16, 1, 0.3, 1)` easing, no cards/shadows/gradients.

## Approach

Framer-motion for everything (approach A). It is already a dependency
(ScrollReveal, gallery, services all use it), motion values run outside the
React render loop, and `useReducedMotion` is built in. No new dependencies.

Rejected: pure CSS (parallax and cursor tilt need JS anyway, ends up split
across two systems), GSAP (new ~60KB dep that fights framer-motion for frames,
overkill for whisper-level effects).

## Spec

All effects at whisper intensity. The sum should read "alive", never "busy".

### 1. Entry choreography (~1.4s total, plays once on load)

Sequence, all using the site-standard ease `[0.16, 1, 0.3, 1]`:

1. Hairline above eyebrow: `scaleX` 0 → 1, origin left, 0.6s
2. Eyebrow: fade in, 0.4s
3. Headline: each of the 3 lines rises (`y` 24px → 0) + fades, staggered 0.12s
4. Subline + CTAs: fade in
5. Hero image: reveals via `clip-path` inset animation, bottom → top, 0.9s

Implementation: framer-motion `variants` with `staggerChildren` on a parent,
image clip via animated `clipPath` style.

### 2. Living background

One large SVG calligraphy flourish stroke, umber at ~4% opacity, positioned
behind the headline's left region. Drifts ±12px translate with slight rotation
over a ~20s loop. CSS keyframes, transform-only (GPU-composited, same lesson
as the gallery marquee jitter fix). `pointer-events-none`, `aria-hidden`.

The flourish SVG is a simple hand-drawn-style curve (pen stroke motif). It is
decoration echoing the calligraphy brand, not an icon; a single elegant path.

### 3. Scroll parallax

Scoped to the hero section via `useScroll({ target: sectionRef })`:

- Image: `y` 0 → -24px across hero scroll progress
- Headline block: `y` 0 → +12px

Motion values via `useTransform`, never React state per frame.

### 4. Micro-interactions

- CTA arrow: nudges right 4px on hover (extends existing underline-grow)
- Hero image: scale 1.02 + tilt max 1.5deg following cursor, spring-damped
  (`useMotionValue` + `useSpring`), resets on leave
- Italic "a story.": slow underline draw on hover (reuse `underline-grow`
  treatment at slower duration)

### Reduced motion

`useReducedMotion()`: all four collapse to static render. Living background
also gated behind `@media (prefers-reduced-motion: reduce)` in CSS.

### Files touched

- `src/components/Hero.tsx` — choreography, parallax, tilt, flourish placement
- `src/index.css` — flourish drift keyframes, reduced-motion gate

No changes to other sections, content, or layout. Desktop and mobile both get
entry choreography; parallax and cursor tilt are pointer-device effects and
degrade naturally on touch.

## Success criteria

- Hero feels alive on load and during scroll, but no effect calls attention
  to itself individually
- No layout shift (CLS ~0): all motion via transform/opacity/clip-path
- Reduced-motion users see the current static hero
- No console errors, TypeScript clean, build passes
