import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PlaceholderImage from './PlaceholderImage'
import ScrollReveal from './ScrollReveal'
import { galleryFilters, services, type GalleryFilter } from '../data/content'
import { getImages } from '../lib/images'

const aspects = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]']
// Signage is shot as wide tabletop scenes — the portrait aspects above would
// crop out the display pieces on either side of the frame.
const landscapeAspects = ['aspect-[4/3]', 'aspect-[3/2]']

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

export default function Gallery() {
  const [active, setActive] = useState<GalleryFilter>('All')
  const entries = useMemo(buildGalleryEntries, [])

  const filtered =
    active === 'All'
      ? services.flatMap((service) => entries.filter((entry) => entry.category === service.category).slice(0, 2))
      : entries.filter((entry) => entry.category === active)

  return (
    <section id="gallery" className="grain bg-alabaster border-t border-umber/40 py-32 px-6 md:px-12 scroll-mt-24">
      <span className="spaced-caps text-[0.8rem] text-umber block mb-10">Gallery</span>

      <div className="flex flex-wrap gap-6 mb-4">
        {galleryFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`spaced-caps text-[0.8rem] pb-1 border-b transition-colors ${
              active === filter ? 'text-umber border-umber' : 'text-umber/50 border-transparent'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="italic-safe mb-16"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
        >
          Each stroke, a thought made visible.
        </motion.p>
      </AnimatePresence>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {filtered.map((entry, i) => {
          const list = entry.category === 'Signage' ? landscapeAspects : aspects
          const aspect = list[i % list.length]
          return (
            <ScrollReveal key={entry.id} delay={(i % 6) * 0.06} className="mb-6 break-inside-avoid">
              {entry.src ? (
                <img
                  src={entry.src}
                  alt={`${entry.category} by The Pluming Tales Company`}
                  className={`${aspect} w-full object-cover transition-opacity duration-[400ms] ease-in-out hover:opacity-[0.88]`}
                />
              ) : (
                <PlaceholderImage
                  className={`${aspect} w-full transition-opacity duration-[400ms] ease-in-out hover:opacity-[0.88]`}
                />
              )}
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
