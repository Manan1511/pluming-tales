import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from 'framer-motion'
import { processSteps } from '../data/content'
import SmartImage from './SmartImage'

const thresholds = [0.12, 0.33, 0.54, 0.75]

// The row layout only alternates left/right from md upward (below that,
// each row's photo is centered) — the line's checkpoints need to track
// that same breakpoint or they stop lining up with the photos on mobile.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => setIsDesktop(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const numberVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// The checkpoint photo starts dim and desaturated, like unlit glass, then
// "illuminates" to full color and a warm glow the instant the drawn line
// reaches its checkpoint — same trigger (isReached) as the text reveal.
const imageVariants = {
  hidden: {
    opacity: 0.3,
    filter: 'grayscale(1) brightness(0.5)',
    boxShadow: '0 0 0 rgba(201, 168, 106, 0)',
  },
  visible: {
    opacity: 1,
    filter: 'grayscale(0) brightness(1)',
    boxShadow: '0 0 32px rgba(201, 168, 106, 0.45)',
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const isDesktop = useIsDesktop()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })
  const [maxProgress, setMaxProgress] = useState(0)
  const maxScrollProgress = useMotionValue(0)

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > maxScrollProgress.get()) {
      maxScrollProgress.set(latest)
    }
    if (latest > maxProgress) {
      setMaxProgress(latest)
    }
  })

  useEffect(() => {
    setMaxProgress(0)
    maxScrollProgress.set(0)
  }, [])

  const pathDraw = useTransform(maxScrollProgress, (progress) => {
    if (progress <= 0.12) return 0
    if (progress <= 0.33) {
      return ((progress - 0.12) / (0.33 - 0.12)) * 0.28
    }
    if (progress <= 0.54) {
      return 0.28 + ((progress - 0.33) / (0.54 - 0.33)) * (0.62 - 0.28)
    }
    if (progress <= 0.75) {
      return 0.62 + ((progress - 0.54) / (0.75 - 0.54)) * (0.88 - 0.62)
    }
    if (progress <= 0.80) {
      return 0.88 + ((progress - 0.75) / (0.80 - 0.75)) * (1.0 - 0.88)
    }
    return 1
  })

  // Checkpoints sit at each row's photo (near the section edge), not the
  // numeral — the numeral's open counters used to let the curve show through
  // and read as crossing the digits. Anchoring on the photo also means the
  // line visually arrives at the thing it's illuminating.
  const pts = processSteps.map((step, i) => {
    const n = processSteps.length
    const y = 16 + (i * 70) / Math.max(1, n - 1)
    const x = isDesktop ? (step.align === 'left' ? 9 : 91) : 50
    return { x, y }
  })

  const buildPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return ''
    let d = `M ${points[0].x},${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1]
      const p1 = points[i]
      const cx = (p0.x + p1.x) / 2
      d += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`
    }
    return d
  }

  const pathD = buildPath(pts)

  return (
    <section ref={sectionRef} className="relative bg-onyx text-alabaster py-32 overflow-hidden">
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ pointerEvents: 'none' }}
      >
        <motion.path
          d={pathD}
          fill="none"
          stroke="#C9A86A"
          strokeWidth="0.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
          style={{ pathLength: pathDraw }}
        />
      </svg>
      <div className="relative z-10 flex flex-col gap-16 md:gap-24 px-6 md:px-0">
        {processSteps.map((step, i) => {
          const isReached = maxProgress >= thresholds[i]
          return (
            <div
              key={step.number}
              className={
                step.align === 'left'
                  ? 'w-full text-left md:w-1/2 md:pl-[8vw]'
                  : 'w-full text-left md:w-1/2 md:ml-auto md:pr-[8vw] md:text-right'
              }
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isReached ? 'visible' : 'hidden'}
                className={`flex items-center justify-center gap-6 md:justify-start md:gap-8 ${
                  step.align === 'right' ? 'md:flex-row-reverse' : ''
                }`}
              >
                <motion.div
                  variants={imageVariants}
                  className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0"
                >
                  <SmartImage
                    folder={step.imageFolder}
                    index={step.imageIndex}
                    alt={step.name}
                    className="w-full h-full"
                  />
                </motion.div>

                <div className="flex flex-col min-w-0">
                  <motion.span
                    variants={numberVariants}
                    className="block font-medium text-umber/30"
                    style={{ fontSize: '6rem', lineHeight: 1 }}
                  >
                    {step.number}
                  </motion.span>
                  <motion.span
                    variants={textVariants}
                    className="block spaced-caps text-[0.95rem] mt-4 text-[#C9A86A]"
                  >
                    {step.name}
                  </motion.span>
                  <motion.span
                    variants={textVariants}
                    className="italic-safe block text-alabaster/75 mt-2 text-lg"
                  >
                    {step.description}
                  </motion.span>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
