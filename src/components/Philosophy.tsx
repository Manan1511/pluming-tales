import ScrollReveal from './ScrollReveal'
import { philosophy } from '../data/content'
import engravingImage from '../assets/images/services/engraving/drive-download-20260-04.jpg'
import pinkBagImage from '../assets/images/about/philosophy-new.jpg'

// Set this to false to easily revert to the original engraving image
const USE_NEW_IMAGE = true

export default function Philosophy() {
  const activeImage = USE_NEW_IMAGE ? pinkBagImage : engravingImage

  return (
    <section id="about" className="grain bg-oatmere py-32 px-6 md:px-12 scroll-mt-24">
      <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-start">
        <div>
          <ScrollReveal>
            <span className="block w-10 h-px bg-umber mb-8" />
            <h2 className="font-normal max-w-[720px]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {philosophy.heading}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="flex flex-col gap-6 mt-10">
            {philosophy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-[1.8] max-w-[60ch]">
                {paragraph}
              </p>
            ))}
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.14} className="w-full max-w-[560px] md:justify-self-end">
          <img
            src={activeImage}
            alt="Calligraphy detail by The Pluming Tales Company"
            className="w-full aspect-[4/5] object-cover"
          />
        </ScrollReveal>
      </div>
    </section>
  )
}
