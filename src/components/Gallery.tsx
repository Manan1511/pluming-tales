import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import PlaceholderImage from './PlaceholderImage'
import { services } from '../data/content'
import { getImages } from '../lib/images'

interface GalleryEntry {
  id: string
  category: string
  src?: string
}

function buildGalleryEntries(): GalleryEntry[] {
  return services.flatMap((service) => {
    const images = getImages(`gallery/${service.slug}`)
    if (images.length === 0) {
      return [{ id: `${service.slug}-placeholder`, category: service.category }]
    }
    return images.map((src, i) => ({ id: `${service.slug}-${i}`, category: service.category, src }))
  })
}

const SPEED_PX_PER_SEC = 40
// Minimum cards a row needs to still feel like a full, alive marquee.
// Thin categories get padded by cycling back through their own shuffled set.
const MIN_ROW_CARDS = 6

function shuffle(list: GalleryEntry[]): GalleryEntry[] {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function padToMin(list: GalleryEntry[]): GalleryEntry[] {
  if (list.length === 0 || list.length >= MIN_ROW_CARDS) return list
  const out = [...list]
  let i = 0
  while (out.length < MIN_ROW_CARDS) {
    const src = list[i % list.length]
    out.push({ ...src, id: `${src.id}-pad${i}` })
    i++
  }
  return out
}

// One fixed aspect for every card, regardless of category: mixed aspect
// ratios (portrait vs. Signage's wider tabletop shots) made rows look
// jagged whenever categories shuffled together. object-cover crops to fit
// rather than stretching.
const CARD_ASPECT = 'aspect-[4/5]'

function GalleryCard({ entry }: { entry: GalleryEntry }) {
  return entry.src ? (
    <img
      src={entry.src}
      alt={`${entry.category} by The Pluming Tales Company`}
      className={`${CARD_ASPECT} w-full object-cover transition-opacity duration-[400ms] ease-in-out hover:opacity-[0.88]`}
      loading="lazy"
    />
  ) : (
    <PlaceholderImage
      className={`${CARD_ASPECT} w-full transition-opacity duration-[400ms] ease-in-out hover:opacity-[0.88]`}
    />
  )
}

const CARD_WIDTH_CLASS = 'shrink-0 w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[27vw] max-w-[420px]'

function GalleryRow({ items, reverse }: { items: GalleryEntry[]; reverse: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [duration, setDuration] = useState(30)

  // Duplicated so the row can loop seamlessly: the track animates from 0 to
  // -50% (exactly one copy's width), then jumps back to 0, unnoticed.
  const looped = [...items, ...items.map((entry) => ({ ...entry, id: `${entry.id}-loop` }))]

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const halfWidth = el.scrollWidth / 2
    if (halfWidth > 0) setDuration(halfWidth / SPEED_PX_PER_SEC)
  }, [items])

  if (reduceMotion) {
    return (
      <div className="flex gap-6 overflow-x-auto scrollbar-none pb-2">
        {items.map((entry) => (
          <div key={entry.id} className={CARD_WIDTH_CLASS}>
            <GalleryCard entry={entry} />
          </div>
        ))}
      </div>
    )
  }

  const pause = () => setPaused(true)
  const resume = () => setPaused(false)

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        className="flex gap-6 w-max animate-marquee"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {looped.map((entry) => (
          <div key={entry.id} className={CARD_WIDTH_CLASS}>
            <GalleryCard entry={entry} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Gallery() {
  const entries = useMemo(buildGalleryEntries, [])

  // Shuffled once per mount rather than on every render, so the rows don't
  // jump around during unrelated re-renders.
  const { row1, row2 } = useMemo(() => {
    const shuffled = shuffle(entries)
    const half = Math.ceil(shuffled.length / 2)
    return {
      row1: padToMin(shuffled.slice(0, half)),
      row2: padToMin(shuffled.slice(half)),
    }
  }, [entries])

  return (
    <section id="gallery" className="grain bg-alabaster border-t border-umber/40 py-32 px-6 md:px-12 scroll-mt-24">
      <span className="spaced-caps text-[1.05rem] text-umber block mb-10">Gallery</span>

      <p className="italic-safe mb-12" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
        Each stroke, a thought made visible.
      </p>

      <div className="flex flex-col gap-6">
        <GalleryRow items={row1} reverse={false} />
        <GalleryRow items={row2} reverse />
      </div>
    </section>
  )
}
