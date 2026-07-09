import ScrollReveal from './ScrollReveal'
import SmartImage from './SmartImage'
import { whyChooseUs } from '../data/content'

export default function WhyChooseUs() {
  return (
    <section className="grain bg-alabaster py-32 px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Title & Image (sticky so it stays in place during scroll) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col">
          <ScrollReveal>
            <span className="block w-10 h-px bg-umber mb-8" />
            <h2 
              className="font-normal leading-tight -tracking-[0.01em] mb-6" 
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
            >
              Why Clients
              <br />
              Choose Us
            </h2>
            <p className="text-lg leading-[1.8] text-umber/80 mb-12 max-w-[32ch]">
              Thoughtful craftsmanship, attention to detail, and personalized experiences designed to leave a lasting impression.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="aspect-[3/4] w-full overflow-hidden shadow-sm">
              <SmartImage
                folder="why-choose-us"
                alt="Bespoke luxury personalization detail"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Values Vertical Stack */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-umber/20 lg:mt-6">
          {whyChooseUs.map((item, i) => {
            const formattedNumber = String(i + 1).padStart(2, '0')
            return (
              <ScrollReveal
                key={item.name}
                delay={i * 0.08}
                className="py-10 first:pt-0 last:pb-0"
              >
                <div className="flex items-baseline gap-6">
                  {/* Number styled in italic-safe font */}
                  <span className="italic-safe font-serif text-2xl text-umber font-light tracking-wide">
                    {formattedNumber}
                  </span>
                  <div className="flex flex-col">
                    <h3 
                      className="font-normal text-onyx mb-3" 
                      style={{ fontSize: 'clamp(1.35rem, 2vw, 1.8rem)' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-base md:text-lg leading-[1.8] text-umber/90 max-w-[50ch]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

      </div>
    </section>
  )
}
