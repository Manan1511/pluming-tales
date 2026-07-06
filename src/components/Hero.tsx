import SmartImage from './SmartImage'
import { hero } from '../data/content'

export default function Hero() {
  return (
    <section className="grain relative px-6 md:px-12 pt-16">
      <div className="min-h-[calc(100dvh-4rem)] w-full flex items-center">
        <div className="w-full flex flex-col md:flex-row gap-12 md:gap-8">
          <div className="w-full md:w-[55%] flex flex-col justify-center">
            <span className="block w-20 h-px bg-umber mb-8" />
            <span className="spaced-caps text-[0.8rem] mb-6">{hero.eyebrow}</span>
            <h1
              className="font-medium -tracking-[0.02em]"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 1 }}
            >
              Where every
              <br />
              stroke tells
              <br />
              <span className="italic-safe">a story.</span>
            </h1>
            <p
              className="italic-safe mt-8 max-w-[38ch]"
              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
            >
              {hero.subheadline}
            </p>

            <div className="flex flex-wrap items-baseline gap-8 mt-10">
              {hero.ctas.map((cta) => {
                const primary = cta.label === 'Enquire Now'
                return (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={
                      primary
                        ? 'spaced-caps inline-block text-[0.85rem] w-fit font-medium border-b border-umber pb-1'
                        : 'underline-grow spaced-caps inline-block text-[0.85rem] w-fit'
                    }
                  >
                    {cta.label} →
                  </a>
                )
              })}
            </div>
          </div>

          <div className="w-full md:w-[45%]">
            <SmartImage
              folder="hero"
              alt="Hands hand-lettering calligraphy on parchment"
              className="aspect-[3/4] w-full md:mt-[20%] md:-mb-24"
            />
          </div>
        </div>
      </div>

      <div className="relative md:w-[55%] pt-16 pb-24">
        <span className="block w-10 h-px bg-umber mb-8" />
        <div className="flex flex-col gap-4">
          {hero.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-[1.8] max-w-[52ch]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
