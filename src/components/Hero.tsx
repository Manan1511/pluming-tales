import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import SmartImage from './SmartImage'
import HeroInkFluid from './HeroInkFluid'
import logo from '../assets/logo.svg'
import { hero } from '../data/content'

const EASE = [0.16, 1, 0.3, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const hairlineGrow: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: EASE } },
}

// Bottom-up reveal: top edge starts pushed fully down, then lifts away.
const clipReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  show: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.9, ease: EASE } },
}

const headlineLines = ['Where every', 'stroke tells']

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax scoped to the hero: image drifts up, headline drifts down.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -24])
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 12])

  // Cursor tilt on the hero image (pointer devices only).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [1.5, -1.5]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-1.5, 1.5]), {
    stiffness: 150,
    damping: 20,
  })

  const onImageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onImageLeave = () => {
    px.set(0)
    py.set(0)
  }

  const animateProps = reduceMotion
    ? {}
    : { variants: container, initial: 'hidden' as const, animate: 'show' as const }

  return (
    <section ref={sectionRef} className="grain relative px-6 md:px-12 pt-16 overflow-hidden">
      {/* Living background: ink splashing in from the right, diffusing like in water. */}
      <HeroInkFluid />

      <motion.div className="min-h-[calc(100dvh-4rem)] w-full flex items-center" {...animateProps}>
        <div className="w-full flex flex-col md:flex-row gap-12 md:gap-8">
          <motion.div className="w-full md:w-[55%] flex flex-col justify-center" style={{ y: headlineY }}>
            <motion.span
              className="block w-20 h-px bg-umber mb-8 origin-left"
              variants={reduceMotion ? undefined : hairlineGrow}
            />
            {/* Logo mark replaces the old text eyebrow (which just repeated
                the company name the logo already says). */}
            <motion.img
              src={logo}
              alt="The Pluming Tales Company"
              className="self-start h-16 md:h-20 w-auto mb-6"
              variants={reduceMotion ? undefined : rise}
            />
            <h1 className="font-medium -tracking-[0.02em]" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 1 }}>
              {headlineLines.map((line) => (
                <motion.span key={line} className="block" variants={reduceMotion ? undefined : rise}>
                  {line}
                </motion.span>
              ))}
              <motion.span className="block" variants={reduceMotion ? undefined : rise}>
                <span className="italic-safe underline-grow">a story.</span>
              </motion.span>
            </h1>
            <motion.p
              className="italic-safe mt-8 max-w-[38ch]"
              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
              variants={reduceMotion ? undefined : rise}
            >
              {hero.subheadline}
            </motion.p>

            <motion.div className="flex flex-wrap items-baseline gap-8 mt-10" variants={reduceMotion ? undefined : rise}>
              {hero.ctas.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="group underline-grow spaced-caps inline-flex items-baseline gap-1.5 text-[0.85rem] w-fit"
                >
                  {cta.label}
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          <div className="w-full md:w-[45%]">
            <motion.div
              className="md:mt-[20%] md:-mb-24"
              style={{ y: imageY }}
              variants={reduceMotion ? undefined : clipReveal}
            >
              <motion.div
                onMouseMove={onImageMove}
                onMouseLeave={onImageLeave}
                style={{ rotateX, rotateY, transformPerspective: 900 }}
                className="transition-transform duration-500 ease-out hover:scale-[1.02]"
              >
                <SmartImage
                  folder="hero"
                  alt="Hands hand-lettering calligraphy on parchment"
                  className="aspect-[3/4] w-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="relative md:w-[55%] pt-16 pb-24">
        <span className="block w-10 h-px bg-umber mb-8" />
        <div className="flex flex-col gap-4">
          {hero.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-[1.8] max-w-[52ch]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
