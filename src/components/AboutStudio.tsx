import { aboutStudio } from '../data/content'
import SmartImage from './SmartImage'
import ScrollReveal from './ScrollReveal'

export default function AboutStudio() {
  return (
    <section id="about" className="grain relative bg-oatmere py-32 overflow-hidden scroll-mt-24">
      <span
        className="absolute top-8 right-6 md:right-12 font-medium text-umber opacity-15 select-none"
        style={{ fontSize: '8rem' }}
        aria-hidden="true"
      >
        01
      </span>

      <div className="relative px-6 md:px-12 flex flex-col md:flex-row gap-10 md:gap-16">
        <ScrollReveal className="w-full md:w-[60%]">
          <span className="block w-10 h-px bg-umber mb-8" />
          <h2 className="font-normal max-w-[680px]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            {aboutStudio.heading}
          </h2>
          <div className="flex flex-col gap-6 mt-8 max-w-[52ch]">
            {aboutStudio.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-[1.8]">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="w-full md:w-[40%] md:mt-16">
          <SmartImage folder="about" alt="Materials used at The Pluming Tales Company studio" className="aspect-[3/5] w-full" />
        </ScrollReveal>
      </div>
    </section>
  )
}
