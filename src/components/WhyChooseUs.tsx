import ScrollReveal from './ScrollReveal'
import SmartImage from './SmartImage'
import { whyChooseUs } from '../data/content'

// Set this to false to easily revert to the original full-width alternating list layout
const USE_NEW_LAYOUT = true

export default function WhyChooseUs() {
  if (!USE_NEW_LAYOUT) {
    return (
      <section className="grain bg-alabaster py-32 px-6 md:px-12">
        <span className="block w-10 h-px bg-umber mb-8" />
        <h2 className="font-normal max-w-[680px]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          Why Clients Choose Us
        </h2>

        <div className="mt-16 flex flex-col">
          {whyChooseUs.map((item, i) => {
            const rightAligned = i % 2 === 1
            const indent = rightAligned ? 'md:pl-[20vw] md:pr-0 md:text-right' : 'md:pl-0 md:pr-[20vw]'
            return (
              <ScrollReveal
                key={item.name}
                delay={i * 0.06}
                className={`py-10 ${i > 0 ? 'border-t border-umber/40' : ''} ${indent}`}
              >
                <h3 className="font-normal" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  {item.name}
                </h3>
                <p className={`text-lg leading-[1.8] mt-3 max-w-[52ch] ${rightAligned ? 'md:ml-auto' : ''}`}>
                  {item.description}
                </p>
              </ScrollReveal>
            )
          })}
        </div>
      </section>
    )
  }

  const leftItems = whyChooseUs.slice(0, 2)
  const bottomItems = whyChooseUs.slice(2)

  return (
    <section className="grain bg-alabaster py-32 px-6 md:px-12">
      <span className="block w-10 h-px bg-umber mb-8" />
      <h2 className="font-normal max-w-[680px] mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
        Why Clients Choose Us
      </h2>

      {/* Top section: 2 columns split (Items on Left, Image on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Column - first two items */}
        <div className="flex flex-col">
          {leftItems.map((item, i) => (
            <ScrollReveal
              key={item.name}
              delay={i * 0.06}
              className={`py-10 border-t border-umber/40 first:pt-0 first:border-0`}
            >
              <h3 className="font-normal" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                {item.name}
              </h3>
              <p className="text-lg leading-[1.8] mt-3 max-w-[52ch]">
                {item.description}
              </p>
            </ScrollReveal>
          ))}
          {/* Divider below both of them (covering only the left side) */}
          <span className="block w-full h-px bg-umber/40" />
        </div>

        {/* Right Column - Image */}
        <ScrollReveal delay={0.12} className="w-full">
          <div className="aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden">
            <SmartImage
              folder="why-choose-us"
              alt="Why clients choose The Pluming Tales Company"
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>
      </div>

      {/* Bottom section: Horizontal 3-column row for the remaining 3 items */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 border-t border-umber/20 pt-16">
        {bottomItems.map((item, i) => (
          <ScrollReveal
            key={item.name}
            delay={(i + 2) * 0.06}
            className="flex flex-col"
          >
            <h3 className="font-normal" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.6rem)' }}>
              {item.name}
            </h3>
            <p className="text-base md:text-lg leading-[1.8] mt-3 max-w-[45ch]">
              {item.description}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
