import { founder } from '../data/content'
import SmartImage from './SmartImage'
import ScrollReveal from './ScrollReveal'

export default function Founder() {
  return (
    <section className="grain relative bg-alabaster py-32 overflow-hidden">
      <span
        className="absolute top-8 left-6 md:left-12 font-medium text-umber opacity-15 select-none"
        style={{ fontSize: '8rem' }}
        aria-hidden="true"
      >
        02
      </span>

      <div className="relative pl-6 pr-6 md:pl-[18vw] md:pr-12">
        <div className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          <ScrollReveal>
            <span className="block w-10 h-px bg-umber mb-8" />
            <h2 className="font-normal max-w-[680px]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {founder.subheading}
            </h2>

            <div className="flex flex-col gap-6 mt-8 max-w-[52ch]">
              {founder.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-[1.8]">
                  {paragraph}
                </p>
              ))}
              <p className="italic-safe text-2xl mt-2">{founder.closingLine}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="w-full max-w-[560px] md:justify-self-end">
            <SmartImage
              folder="founder"
              alt="Neha Chhabria, founder of The Pluming Tales Company"
              className="aspect-[4/5] w-full"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
