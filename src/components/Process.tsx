import ScrollReveal from './ScrollReveal'
import { processSteps } from '../data/content'

export default function Process() {
  return (
    <section className="relative bg-onyx text-alabaster py-32 overflow-hidden">
      <span
        className="absolute left-1/2 top-0 bottom-0 w-px bg-umber -translate-x-1/2"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-24">
        {processSteps.map((step, i) => (
          <ScrollReveal
            key={step.number}
            delay={i * 0.1}
            className={
              step.align === 'left'
                ? 'w-1/2 pl-[8vw] text-left'
                : 'w-1/2 ml-auto pr-[8vw] text-right'
            }
          >
            <span
              className="block font-medium text-umber/30"
              style={{ fontSize: '6rem', lineHeight: 1 }}
            >
              {step.number}
            </span>
            <span className="block text-[0.75rem] tracking-[0.2em] mt-4">
              {step.name.toUpperCase()}
            </span>
            <span className="italic-safe block text-alabaster/75 mt-2 text-lg">
              {step.description}
            </span>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
