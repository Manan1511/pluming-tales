import ScrollReveal from './ScrollReveal'
import { whyChooseUs } from '../data/content'

export default function WhyChooseUs() {
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
