import PlaceholderImage from './PlaceholderImage'

export default function Hero() {
  return (
    <section className="grain relative min-h-dvh flex items-center px-6 md:px-12 pt-16">
      <div className="w-full flex flex-col md:flex-row gap-12 md:gap-8">
        <div className="w-full md:w-[55%] flex flex-col justify-center">
          <span className="block w-20 h-px bg-umber mb-8" />
          <span className="text-[0.7rem] tracking-[0.2em] mb-6">THE PLUMING TALES COMPANY</span>
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
            Bespoke calligraphy &amp; personalized keepsakes, crafted by hand.
          </p>
          <a
            href="#contact"
            className="underline-grow inline-block mt-10 text-[0.8rem] tracking-[0.18em] w-fit"
          >
            BEGIN YOUR STORY →
          </a>
        </div>

        <div className="w-full md:w-[45%]">
          <PlaceholderImage className="aspect-[3/4] w-full md:mt-[20%] md:-mb-24" />
        </div>
      </div>
    </section>
  )
}
