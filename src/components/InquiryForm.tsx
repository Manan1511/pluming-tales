import { useState, type FormEvent } from 'react'
import ScrollReveal from './ScrollReveal'
import { enquiry, formspreeEndpoint, serviceOptions } from '../data/content'

const fieldClass =
  'w-full bg-transparent border-b border-onyx/30 py-2 focus:border-umber focus:outline-none transition-colors duration-300 text-lg'

const labelClass = 'block spaced-caps text-[0.88rem] mb-2'

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
            {enquiry.heading}
          </h2>
          {enquiry.paragraphs.map((paragraph) => (
            <p key={paragraph} className="italic-safe mt-4 text-xl">
              {paragraph}
            </p>
          ))}
        </ScrollReveal>

        {status === 'success' ? (
          <ScrollReveal delay={0.1} className="mt-12">
            <p className="italic-safe text-xl">
              Thank you, your story has been sent. We'll be in touch soon.
            </p>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div>
                <label htmlFor="name" className={labelClass}>
                  NAME
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
                <label htmlFor="phone" className={labelClass}>
                  PHONE NUMBER
                </label>
                <input id="phone" name="phone" type="tel" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="company" className={labelClass}>
                  COMPANY NAME (OPTIONAL)
                </label>
                <input id="company" name="company" type="text" className={fieldClass} />
              </div>

              <div>
                <label htmlFor="date" className={labelClass}>
                  EVENT DATE
                </label>
                <input id="date" name="date" type="date" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="quantity" className={labelClass}>
                  QUANTITY REQUIRED
                </label>
                <input id="quantity" name="quantity" type="number" min={1} required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="budget" className={labelClass}>
                  BUDGET RANGE
                </label>
                <input id="budget" name="budget" type="text" required className={fieldClass} />
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  LOCATION
                </label>
                <input id="location" name="location" type="text" required className={fieldClass} />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="service" className={labelClass}>
                  SERVICE REQUIRED
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

              <div className="md:col-span-2">
                <label htmlFor="project" className={labelClass}>
                  TELL US ABOUT YOUR PROJECT
                </label>
                <textarea
                  id="project"
                  name="project"
                  required
                  className={`${fieldClass} min-h-[140px] resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="md:col-span-2 underline-grow spaced-caps w-fit text-[0.95rem] mt-4 disabled:opacity-50"
              >
                {status === 'submitting' ? 'SENDING…' : enquiry.submitLabel}
              </button>

              {status === 'error' && (
                <p className="md:col-span-2 text-sm text-umber">
                  Something went wrong. Please try again or reach out directly.
                </p>
              )}
            </form>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
