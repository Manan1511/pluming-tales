import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PlaceholderImage from './PlaceholderImage'
import ScrollReveal from './ScrollReveal'
import { galleryFilters, galleryItems } from '../data/content'

export default function Gallery() {
  const [active, setActive] = useState<(typeof galleryFilters)[number]>('All')

  const filtered =
    active === 'All' ? galleryItems : galleryItems.filter((item) => item.category === active)

  return (
    <section id="gallery" className="grain bg-alabaster py-32 px-6 md:px-12">
      <div className="flex flex-wrap gap-6 mb-4">
        {galleryFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`text-[0.7rem] tracking-[0.2em] pb-1 border-b transition-colors ${
              active === filter
                ? 'text-umber border-umber'
                : 'text-umber/50 border-transparent'
            }`}
          >
            {filter.toUpperCase()}
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
        {filtered.map((item, i) => (
          <ScrollReveal key={item.id} delay={(i % 6) * 0.06} className="mb-6 break-inside-avoid">
            <PlaceholderImage
              className={`${item.aspect} w-full transition-opacity duration-[400ms] ease-in-out hover:opacity-[0.88]`}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
