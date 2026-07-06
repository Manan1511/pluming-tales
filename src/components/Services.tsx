import SmartImage from './SmartImage'
import ScrollReveal from './ScrollReveal'
import { services, type Service } from '../data/content'

function ChosenFor({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {items.slice(0, 5).map((item) => (
        <span key={item} className="spaced-caps text-[0.68rem] text-umber/80">
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
        <span className="spaced-caps text-[0.75rem] text-umber">{service.number}</span>
        <span className="spaced-caps text-[0.75rem] text-umber">{service.category}</span>
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
              className={`${service.imageAspect ?? 'aspect-[4/5]'} w-full transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]`}
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
          <span className="spaced-caps text-[0.75rem] text-umber">{service.number}</span>
          <span className="spaced-caps text-[0.75rem] text-umber">{service.category}</span>
        </div>
        <h3 className="font-normal mt-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
          {service.name}
        </h3>
        <p className="italic-safe mx-auto mt-6 max-w-[42ch]" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.75rem)' }}>
          {service.whyItMatters}
        </p>
        <p className="text-lg leading-[1.8] mt-6 max-w-[52ch] mx-auto">{service.whatWeCreate}</p>
        <div className="mt-8 flex justify-center">
          <ChosenFor items={service.chosenFor} />
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
            className="aspect-[16/7] w-full transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
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

  return (
    <section id="services" className="grain bg-alabaster px-6 md:px-12 py-24">
      <span className="spaced-caps text-[0.8rem] text-umber">What We Do</span>

      <nav className="flex flex-wrap gap-x-6 gap-y-2 mt-6" aria-label="Services">
        {services.map((service) => (
          <a key={service.slug} href={`#${service.slug}`} className="nav-link spaced-caps text-[0.68rem] text-umber/80">
            {service.category}
          </a>
        ))}
      </nav>

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
    </section>
  )
}
