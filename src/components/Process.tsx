import ScrollReveal from './ScrollReveal'
import { processSteps } from '../data/content'

export default function Process() {
  return (
    <section className="relative bg-onyx text-alabaster py-32 overflow-hidden">
      <span
        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-umber -translate-x-1/2"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-16 md:gap-24 px-6 md:px-0">
        {processSteps.map((step, i) => (
          <ScrollReveal
            key={step.number}
            delay={i * 0.1}
            className={
              step.align === 'left'
                ? 'w-full text-left md:w-1/2 md:pl-[8vw]'
                : 'w-full text-left md:w-1/2 md:ml-auto md:pr-[8vw] md:text-right'
            }
          >
            <span
              className="block font-medium text-umber/30"
              style={{ fontSize: '6rem', lineHeight: 1 }}
            >
              {step.number}
            </span>
            <span className="block spaced-caps text-[0.85rem] mt-4">{step.name}</span>
            <span className="italic-safe block text-alabaster/75 mt-2 text-lg">
              {step.description}
            </span>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
