import ScrollReveal from './ScrollReveal'
import { philosophy } from '../data/content'

export default function Philosophy() {
  return (
    <section id="about" className="grain bg-oatmere py-32 px-6 md:px-12 scroll-mt-24">
      <ScrollReveal>
        <span className="block w-10 h-px bg-umber mb-8" />
        <h2 className="font-normal max-w-[720px]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          {philosophy.heading}
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.08} className="flex flex-col gap-6 mt-10">
        {philosophy.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-[1.8] max-w-[60ch]">
            {paragraph}
          </p>
        ))}
      </ScrollReveal>
    </section>
  )
}
