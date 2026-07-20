import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SmartImage from './SmartImage'
import ScrollReveal from './ScrollReveal'
import { services, type Service } from '../data/content'

function ChosenFor({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
      {items.slice(0, 5).map((item) => (
        <span key={item} className="spaced-caps text-[0.85rem] text-umber">
          {item}
        </span>
      ))}
    </div>
  )
}

function ServiceHeading({ service }: { service: Service }) {
  return (
    <>
      <div className="flex items-baseline gap-4">
        <span className="spaced-caps text-[0.88rem] text-umber">{service.number}</span>
        <span className="spaced-caps text-[0.88rem] text-umber">{service.category}</span>
      </div>
      <h3 className="font-normal mt-4 max-w-[20ch]" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
        {service.name}
      </h3>
    </>
  )
}

function ServiceRowSplit({ service, reversed }: { service: Service; reversed: boolean }) {
  return (
    <div id={service.slug} className="group py-12 scroll-mt-24">
      <div className={`flex flex-col gap-10 md:gap-16 ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        <ScrollReveal className="w-full md:w-[45%]">
          <div className="overflow-hidden">
            <SmartImage
              folder={service.imageFolder ?? `services/${service.slug}`}
              index={service.imageIndex}
              alt={service.name}
              position={service.imagePosition}
              className={`${service.imageAspect ?? 'aspect-[4/5]'} w-full transition-transform duration-[800ms] ease-out hover:scale-[1.04]`}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="w-full md:w-[55%] flex flex-col justify-center">
          <ServiceHeading service={service} />
          <p className="text-lg leading-[1.8] mt-6 max-w-[52ch]">{service.whatWeCreate}</p>
          <p className="text-xl leading-[1.6] mt-4 max-w-[52ch] text-onyx/80">{service.whyItMatters}</p>
          <div className="mt-8">
            <ChosenFor items={service.chosenFor} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeSlug, setActiveSlug] = useState<string>(services[0]?.slug ?? '')

  const activeService = services.find((s) => s.slug === activeSlug) || services[0]
  const activeIndex = services.indexOf(activeService)
  const reversed = activeIndex % 2 === 1

  return (
    <section
      ref={sectionRef}
      id="services"
      className="grain bg-alabaster px-6 md:px-12 py-24 scroll-mt-16"
    >
      <span className="spaced-caps text-[1.05rem] text-umber">What We Do</span>

      <div className="mt-6">
        <nav
          aria-label="Services"
          className="sticky top-16 z-20 bg-alabaster/90 backdrop-blur-sm py-4 border-b border-umber/10 -mx-6 px-6 md:-mx-12 md:px-12"
        >
          <div className="flex gap-6 overflow-x-auto scrollbar-none pb-1 md:flex-wrap md:overflow-visible">
            {services.map((service) => (
              <button
                key={service.slug}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSlug(service.slug)
                  sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`spaced-caps text-[0.8rem] pb-1 border-b transition-colors whitespace-nowrap ${
                  activeSlug === service.slug ? 'text-umber border-umber' : 'text-onyx/60 border-transparent'
                }`}
                aria-current={activeSlug === service.slug ? 'true' : undefined}
              >
                {service.category}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeService && (
            <motion.div
              key={activeService.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ServiceRowSplit service={activeService} reversed={reversed} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
