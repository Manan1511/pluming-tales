import ScrollReveal from './ScrollReveal'
import SmartImage from './SmartImage'
import { collaborations } from '../data/content'

export default function BrandCollaborations() {
  return (
    <section className="grain relative bg-oatmere py-32 overflow-hidden">
      <span
        className="absolute top-8 left-6 md:left-12 font-medium text-umber opacity-15 select-none"
        style={{ fontSize: '8rem' }}
        aria-hidden="true"
      >
        03
      </span>

      <div className="relative pl-6 pr-6 md:pl-[20vw] md:pr-12">
        <ScrollReveal>
          <span className="block w-10 h-px bg-umber mb-8" />
          <h2 className="font-normal max-w-[680px]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            {collaborations.heading}
          </h2>
          <div className="flex flex-col gap-6 mt-8 max-w-[52ch]">
            {collaborations.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-[1.8]">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-12 md:pr-[10%]">
          <SmartImage
            folder="brand-collaborations"
            alt="Brand activation and on-site personalisation by The Pluming Tales Company"
            className="aspect-[2/1] w-full"
          />
        </ScrollReveal>
      </div>
    </section>
  )
}
