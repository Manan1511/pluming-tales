import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SmartImage from './SmartImage'
import ScrollReveal from './ScrollReveal'
import { services, type Service } from '../data/content'

function ChosenFor({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
      {items.slice(0, 5).map((item) => (
        <span key={item} className="spaced-caps text-[0.85rem] text-umber/80">
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
              folder={`services/${service.slug}`}
              alt={service.name}
              className={`${service.imageAspect ?? 'aspect-[4/5]'} w-full transition-transform duration-[800ms] ease-out hover:scale-[1.04]`}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="w-full md:w-[55%] flex flex-col justify-center">
          <ServiceHeading service={service} />
          <p className="text-lg leading-[1.8] mt-6 max-w-[52ch]">{service.whatWeCreate}</p>
          <p className="italic-safe text-xl mt-4 max-w-[52ch]">{service.whyItMatters}</p>
          <div className="mt-8">
            <ChosenFor items={service.chosenFor} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

/* Text-only rhythm break: no image, so nothing to crop. Breaks up the split
   pattern without forcing a portrait photo into a landscape frame. */
function ServiceRowEmphasis({ service }: { service: Service }) {
  return (
    <div id={service.slug} className="py-12 scroll-mt-24">
      <ScrollReveal className="max-w-[720px] mx-auto text-center">
        <div className="flex items-baseline justify-center gap-4">
          <span className="spaced-caps text-[0.88rem] text-umber">{service.number}</span>
          <span className="spaced-caps text-[0.88rem] text-umber">{service.category}</span>
        </div>
        <h3 className="font-normal mt-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
          {service.name}
        </h3>
        <p className="italic-safe mx-auto mt-6 max-w-[42ch]" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.75rem)' }}>
          {service.whyItMatters}
        </p>
        <p className="text-lg leading-[1.8] mt-6 max-w-[52ch] mx-auto">{service.whatWeCreate}</p>
        <div className="mt-8 flex justify-center">
          <ChosenFor items={service.chosenFor} className="justify-center" />
        </div>
      </ScrollReveal>
    </div>
  )
}

/* Reserved for services shot landscape (currently only Signage) so the banner
   never has to crop a portrait photo into a wide frame. */
function ServiceRowWide({ service }: { service: Service }) {
  return (
    <div id={service.slug} className="group py-12 scroll-mt-24">
      <ScrollReveal>
        <ServiceHeading service={service} />
      </ScrollReveal>

      <ScrollReveal delay={0.08} className="mt-10">
        <div className="overflow-hidden">
          <SmartImage
            folder={`services/${service.slug}`}
            alt={service.name}
            className="aspect-[16/7] w-full transition-transform duration-[800ms] ease-out hover:scale-[1.04]"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.14} className="mt-10 flex flex-col md:flex-row gap-8 md:gap-16">
        <p className="text-lg leading-[1.8] md:w-1/2 max-w-[52ch]">{service.whatWeCreate}</p>
        <div className="md:w-1/2">
          <p className="italic-safe text-xl max-w-[42ch]">{service.whyItMatters}</p>
          <div className="mt-6">
            <ChosenFor items={service.chosenFor} />
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}

/* Only Signage has genuinely landscape source photos, so it's the only wide
   banner. Invitations and On-Site break up the split rhythm as text-only
   emphasis rows instead of forcing a wide crop onto a portrait photo. */
const LAYOUTS: Record<string, 'split' | 'emphasis' | 'wide'> = {
  engraving: 'split',
  embossing: 'split',
  invitations: 'emphasis',
  gilding: 'split',
  stationery: 'split',
  'on-site': 'emphasis',
  signage: 'wide',
}

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeSlug, setActiveSlug] = useState<string>(services[0]?.slug ?? '')

  const activeService = services.find((s) => s.slug === activeSlug) || services[0]
  const splitServices = services.filter((s) => LAYOUTS[s.slug] === 'split' || !LAYOUTS[s.slug])
  const splitIndex = splitServices.indexOf(activeService)
  const reversed = splitIndex % 2 === 1

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
                className={`spaced-caps text-[0.8rem] pb-1 border-b transition-colors whitespace-nowrap cursor-pointer ${
                  activeSlug === service.slug ? 'text-umber border-umber' : 'text-umber/50 border-transparent'
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
              {(() => {
                const layout = LAYOUTS[activeService.slug] ?? 'split'
                if (layout === 'wide') return <ServiceRowWide service={activeService} />
                if (layout === 'emphasis') return <ServiceRowEmphasis service={activeService} />
                return <ServiceRowSplit service={activeService} reversed={reversed} />
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
