import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from 'framer-motion'
import { processSteps } from '../data/content'

const thresholds = [0.12, 0.33, 0.54, 0.75]

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

export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null)
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

  const pts = processSteps.map((_, i) => {
    const n = processSteps.length
    const y = 16 + (i * 70) / Math.max(1, n - 1)
    const x = i % 2 === 0 ? 24 : 76
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
        className="absolute inset-0 w-full h-full"
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
          opacity="0.9"
          style={{ pathLength: pathDraw }}
        />
      </svg>
      <div className="relative flex flex-col gap-16 md:gap-24 px-6 md:px-0">
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
              >
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
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
