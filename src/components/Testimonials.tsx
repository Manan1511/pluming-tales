import ScrollReveal from './ScrollReveal'
import { testimonials } from '../data/content'

export default function Testimonials() {
  return (
    <section className="bg-oatmere py-32 px-6 md:px-12">
      <span className="block text-[0.7rem] tracking-[0.2em] text-umber mb-16">KIND WORDS</span>

      <div className="flex flex-col gap-20">
        {testimonials.map((t) => (
          <ScrollReveal
            key={t.attribution}
            className="flex flex-col items-center text-center mx-auto max-w-[55ch]"
          >
            <p className="italic-safe text-2xl">{t.quote}</p>
            <span className="w-10 h-px bg-umber mt-6 mb-4" />
            <span className="text-[0.65rem] tracking-[0.2em]">{t.attribution}</span>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
