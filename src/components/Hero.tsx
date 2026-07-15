import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import SmartImage from './SmartImage'
import HeroInkFluid from './HeroInkFluid'
import logo from '../assets/logo.svg'
import { hero } from '../data/content'

const EASE = [0.16, 1, 0.3, 1] as const

// Each element declares its own explicit initial/animate rather than
// inheriting from a parent's variants + staggerChildren: that propagation
// chain broke intermittently through the plain (non-motion) wrapper divs
// in this layout, leaving the whole hero stuck invisible at its "hidden"
// frame. Explicit per-element animation (same pattern as ScrollReveal)
// can't get stuck this way — each motion component owns its own state.
const STAGGER_START = 0.1
const STAGGER_STEP = 0.12

// Browsers suspend requestAnimationFrame in background tabs, which is what
// drives framer-motion's transitions. If the hero mounts in a hidden tab,
// the entrance animation freezes at its "hidden" frame and only plays once
// the tab is foregrounded — from the user's side, content that should have
// appeared instantly instead pops in a moment later. Holding the animate
// target at "hidden" until the page is actually visible means the reveal
// only ever plays while rAF is really running, so it always completes
// promptly instead of stalling then jumping.
function usePageVisible() {
  const [visible, setVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )
  useEffect(() => {
    if (visible) return
    const onChange = () => {
      if (document.visibilityState === 'visible') setVisible(true)
    }
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [visible])
  return visible
}

function riseProps(active: boolean, step: number) {
  if (!active) return {}
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: STAGGER_START + step * STAGGER_STEP, ease: EASE },
  }
}

const headlineLines = ['Where every', 'stroke tells']

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const pageVisible = usePageVisible()
  const animate = !reduceMotion && pageVisible
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

  return (
    <section ref={sectionRef} className="grain relative px-6 md:px-12 pt-16 overflow-hidden">
      {/* Living background: ink splashing in from the right, diffusing like in water. */}
      <HeroInkFluid />

      <div className="min-h-[calc(100dvh-4rem)] w-full flex items-center">
        <div className="w-full flex flex-col md:flex-row gap-12 md:gap-8">
          <motion.div className="w-full md:w-[55%] flex flex-col justify-center" style={{ y: headlineY }}>
            <motion.span
              className="block w-20 h-px bg-umber mb-8 origin-left"
              initial={reduceMotion ? undefined : { scaleX: 0 }}
              animate={reduceMotion ? undefined : { scaleX: animate ? 1 : 0 }}
              transition={{ duration: 0.6, delay: STAGGER_START, ease: EASE }}
            />
            {/* Logo mark replaces the old text eyebrow (which just repeated
                the company name the logo already says). */}
            <motion.img
              src={logo}
              alt="The Pluming Tales Company"
              className="self-start h-16 md:h-20 w-auto mb-6"
              {...riseProps(animate, 1)}
            />
            <h1 className="font-medium -tracking-[0.02em]" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 1 }}>
              {headlineLines.map((line, i) => (
                <motion.span key={line} className="block" {...riseProps(animate, 2 + i)}>
                  {line}
                </motion.span>
              ))}
              <motion.span className="block" {...riseProps(animate, 4)}>
                <span className="italic-safe underline-grow">a story.</span>
              </motion.span>
            </h1>
            <motion.p
              className="italic-safe mt-8 max-w-[38ch]"
              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
              {...riseProps(animate, 5)}
            >
              {hero.subheadline}
            </motion.p>

            <motion.div className="flex flex-wrap items-baseline gap-8 mt-10" {...riseProps(animate, 6)}>
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
              initial={reduceMotion ? undefined : { clipPath: 'inset(100% 0 0 0)' }}
              animate={reduceMotion ? undefined : { clipPath: animate ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
              transition={{ duration: 0.9, delay: STAGGER_START, ease: EASE }}
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
      </div>

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
