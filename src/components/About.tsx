import { brandValues } from '../data/content'
import PlaceholderImage from './PlaceholderImage'
import ScrollReveal from './ScrollReveal'

export default function About() {
  return (
    <section id="about" className="grain relative bg-oatmere py-32 overflow-hidden">
      <span
        className="absolute top-8 left-6 md:left-12 font-medium text-umber opacity-15 select-none"
        style={{ fontSize: '8rem' }}
        aria-hidden="true"
      >
        01
      </span>

      <div className="relative pl-6 pr-6 md:pl-[20vw] md:pr-12">
        <ScrollReveal>
          <span className="block w-10 h-px bg-umber mb-8" />
          <p
            className="italic-safe max-w-[680px]"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
          >
            We create timeless, personalized experiences through the art of calligraphy,
            engraving &amp; hand lettering. Every detail is intentional. Every piece is crafted
            by hand. Every story is beautifully told.
          </p>
        </ScrollReveal>

        <div className="mt-12 flex flex-col md:flex-row gap-6">
          <ScrollReveal delay={0.06} className="w-full md:w-[60%]">
            <PlaceholderImage className="aspect-[16/5] w-full" />
          </ScrollReveal>

          <ScrollReveal delay={0.12} className="w-full md:w-[40%] flex flex-col">
            {brandValues.map((value, i) => (
              <div key={value} className={i > 0 ? 'mt-6 pt-6 border-t border-umber/40' : ''}>
                <span className="text-[0.65rem] tracking-[0.25em]">{value.toUpperCase()}</span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
