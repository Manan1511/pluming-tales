import { useEffect, useRef, useState } from 'react'
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
    <div id={service.slug} className="group py-20 border-t border-umber/40 first:border-t-0 first:pt-8 scroll-mt-24">
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
    <div id={service.slug} className="py-20 border-t border-umber/40 scroll-mt-24">
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
    <div id={service.slug} className="group py-20 border-t border-umber/40 scroll-mt-24">
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
  let splitIndex = 0
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeSlug, setActiveSlug] = useState<string>(services[0]?.slug ?? '')
  const topSentinelRef = useRef<HTMLDivElement | null>(null)
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null)
  const [pinned, setPinned] = useState(false)
  const [sectionInView, setSectionInView] = useState(false)
  const originalNavRef = useRef<HTMLDivElement | null>(null)

  // Determine active subsection by finding the heading nearest the top of the viewport.
  useEffect(() => {
    let rafId = 0

    function computeActive() {
      const offset = Math.round(window.innerHeight * 0.18)
      let closest: { id: string; dist: number } | null = null
      for (const s of services) {
        const el = document.getElementById(s.slug)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top - offset)
        if (!closest || dist < closest.dist) closest = { id: s.slug, dist }
      }
      if (closest && closest.id !== activeSlug) setActiveSlug(closest.id)
    }

    function onScroll() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(computeActive)
    }

    // compute once and then on scroll
    computeActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [activeSlug])

  useEffect(() => {
    const topEl = topSentinelRef.current
    const bottomEl = bottomSentinelRef.current
    if (!topEl || !bottomEl) return

    const bottomObserver = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (e && e.isIntersecting) setSectionInView(false)
      },
      { root: null, threshold: 0 }
    )

    const sectionEl = sectionRef.current
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        setSectionInView(Boolean(e && e.isIntersecting))
      },
      { root: null, threshold: 0 }
    )

    bottomObserver.observe(bottomEl)
    if (sectionEl) sectionObserver.observe(sectionEl)

    return () => {
      bottomObserver.disconnect()
      sectionObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    // Recompute pinned based on original nav position relative to top offset
    let raf = 0
    const headerOffset = 80 // px; adjust if header height differs

    function recompute() {
      const orig = originalNavRef.current
      const sectionEl = sectionRef.current
      if (!orig || !sectionEl) {
        setPinned(false)
        return
      }

      const origRect = orig.getBoundingClientRect()
      const sectionRect = sectionEl.getBoundingClientRect()

      // pinned when inside the section and the original nav's bottom has moved
      // above the header offset (i.e., it's been scrolled past)
      const shouldPin = sectionRect.top < headerOffset && origRect.bottom <= headerOffset && sectionRect.bottom > headerOffset
      setPinned(Boolean(shouldPin))
    }

    function onScroll() {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(recompute)
    }

    recompute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sectionInView])

  return (
    <section ref={sectionRef} id="services" className="grain bg-alabaster px-6 md:px-12 py-24">
      <span className="spaced-caps text-[1.05rem] text-umber">What We Do</span>

      <div className="mt-6">
        <nav
          aria-label="Services"
          className="relative"
        >
          <div ref={topSentinelRef} className="h-0" />
          <div className="hidden md:flex md:items-center md:justify-start">
            <div ref={originalNavRef} className="sticky top-24 z-10 flex gap-6 mb-4">
              {services.map((service) => (
                <a
                  key={service.slug}
                  href={`#${service.slug}`}
                  className={`spaced-caps text-[0.8rem] pb-1 border-b transition-colors whitespace-nowrap ${
                    activeSlug === service.slug ? 'text-umber border-umber' : 'text-umber/50 border-transparent'
                  }`}
                  aria-current={activeSlug === service.slug ? 'true' : undefined}
                >
                  {service.category}
                </a>
              ))}
            </div>
          </div>

          {/* Small screens: compact horizontal nav that doesn't take much space */}
          <div className="md:hidden mt-3 overflow-auto">
            <div className="flex gap-6 mb-4">
              {services.map((service) => (
                <a
                  key={service.slug}
                  href={`#${service.slug}`}
                  className={`spaced-caps text-[0.8rem] pb-1 border-b transition-colors whitespace-nowrap ${
                    activeSlug === service.slug ? 'text-umber border-umber' : 'text-umber/50 border-transparent'
                  }`}
                >
                  {service.category}
                </a>
              ))}
            </div>
          </div>
          {pinned ? (
            <div className="hidden md:block fixed right-6 top-20 z-50">
              <div className="bg-alabaster/80 backdrop-blur-sm px-3 py-2 rounded-md shadow-md">
                <div className="flex gap-4">
                  {services.map((service) => (
                    <a
                      key={service.slug}
                      href={`#${service.slug}`}
                      className={`spaced-caps text-[0.8rem] pb-1 border-b transition-colors whitespace-nowrap ${
                        activeSlug === service.slug ? 'text-umber border-umber' : 'text-umber/50 border-transparent'
                      }`}
                      aria-current={activeSlug === service.slug ? 'true' : undefined}
                    >
                      {service.category}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </nav>
      </div>

      <div className="mt-10">
        {services.map((service) => {
          const layout = LAYOUTS[service.slug] ?? 'split'
          if (layout === 'wide') return <ServiceRowWide key={service.slug} service={service} />
          if (layout === 'emphasis') return <ServiceRowEmphasis key={service.slug} service={service} />
          const reversed = splitIndex % 2 === 1
          splitIndex += 1
          return <ServiceRowSplit key={service.slug} service={service} reversed={reversed} />
        })}
      </div>
          <div ref={bottomSentinelRef} className="h-0" />
    </section>
  )
}
