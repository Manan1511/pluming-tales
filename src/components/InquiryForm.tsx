import { useState, type FormEvent } from 'react'
import ScrollReveal from './ScrollReveal'
import { formspreeEndpoint, occasionTypes, serviceOptions } from '../data/content'

const fieldClass =
  'w-full bg-transparent border-b border-onyx/30 py-2 focus:border-umber focus:outline-none transition-colors duration-300 text-lg'

const labelClass = 'block text-[0.65rem] tracking-[0.2em] mb-2'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.currentTarget),
      })
      setStatus(response.ok ? 'success' : 'error')
      if (response.ok) event.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="bg-alabaster py-32 px-6">
      <div className="max-w-[640px] mx-auto">
        <ScrollReveal>
          <h2 className="font-medium" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Begin Your Story
          </h2>
          <p className="italic-safe mt-4 text-xl">
            Tell us about what you're envisioning — we'll take it from there.
          </p>
        </ScrollReveal>

        {status === 'success' ? (
          <ScrollReveal delay={0.1} className="mt-12">
            <p className="italic-safe text-xl">
              Thank you — your story has been sent. We'll be in touch soon.
            </p>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
              <div>
                <label htmlFor="name" className={labelClass}>
                  FULL NAME
                </label>
                <input id="name" name="name" type="text" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  EMAIL ADDRESS
                </label>
                <input id="email" name="email" type="email" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="whatsapp" className={labelClass}>
                  WHATSAPP NUMBER
                </label>
                <input id="whatsapp" name="whatsapp" type="tel" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="occasion" className={labelClass}>
                  OCCASION TYPE
                </label>
                <select id="occasion" name="occasion" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    &nbsp;
                  </option>
                  {occasionTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="service" className={labelClass}>
                  SERVICE NEEDED
                </label>
                <select id="service" name="service" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    &nbsp;
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className={labelClass}>
                  EVENT / DELIVERY DATE
                </label>
                <input id="date" name="date" type="date" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="quantity" className={labelClass}>
                  APPROXIMATE QUANTITY
                </label>
                <input id="quantity" name="quantity" type="number" min={1} required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="story" className={labelClass}>
                  TELL ME YOUR STORY
                </label>
                <textarea
                  id="story"
                  name="story"
                  required
                  className={`${fieldClass} min-h-[140px] resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="underline-grow w-fit text-[0.8rem] tracking-[0.18em] mt-4 disabled:opacity-50"
              >
                {status === 'submitting' ? 'SENDING…' : 'SEND MY STORY →'}
              </button>

              {status === 'error' && (
                <p className="text-sm text-umber">
                  Something went wrong — please try again or reach out directly.
                </p>
              )}
            </form>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
