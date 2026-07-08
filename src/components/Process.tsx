import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { processSteps } from '../data/content'

export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const [maxProgress, setMaxProgress] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setMaxProgress((current) => (latest > current ? latest : current))
  })

  useEffect(() => {
    setMaxProgress(0)
  }, [])

  const pathDraw = useTransform(() => {
    const progress = maxProgress
    if (progress <= 0.13) return (progress / 0.13) * 0.28
    if (progress <= 0.3) return 0.28 + ((progress - 0.13) / 0.17) * 0.34
    if (progress <= 0.49) return 0.62 + ((progress - 0.3) / 0.19) * 0.26
    if (progress <= 0.62) return 0.88 + ((progress - 0.49) / 0.13) * 0.12
    return 1
  })

  const pts = processSteps.map((_, i) => {
    const n = processSteps.length
    const y = 16 + (i * 70) / Math.max(1, n - 1) // nudge start slightly upward
    const x = i % 2 === 0 ? 24 : 76 // alternate left/right positions (percent)
    return { x, y }
  })

  const buildPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return ''
    let d = `M ${points[0].x},${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1]
      const p1 = points[i]
      const cx = (p0.x + p1.x) / 2
      // gentle curve control points
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
        {processSteps.map((step, i) => (
          <ScrollReveal
            key={step.number}
            delay={i * 0.1}
            className={
              step.align === 'left'
                ? 'w-full text-left md:w-1/2 md:pl-[8vw]'
                : 'w-full text-left md:w-1/2 md:ml-auto md:pr-[8vw] md:text-right'
            }
          >
            <motion.span
              className="block font-medium text-umber/30"
              style={{ fontSize: '6rem', lineHeight: 1 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {step.number}
            </motion.span>
            <motion.span
              className="block spaced-caps text-[0.95rem] mt-4"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.45, delay: i * 0.08 + 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {step.name}
            </motion.span>
            <motion.span
              className="italic-safe block text-alabaster/75 mt-2 text-lg"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.45, delay: i * 0.08 + 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {step.description}
            </motion.span>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
