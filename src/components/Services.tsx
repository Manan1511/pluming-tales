import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import PlaceholderImage from './PlaceholderImage'
import { services, type Service } from '../data/content'

function ServicePanel({ number, name }: Service) {
  return (
    <div className="group relative w-[280px] min-h-[500px] flex-shrink-0 bg-alabaster border-r border-umber last:border-r-0 overflow-hidden">
      <span className="absolute top-4 right-4 text-[0.65rem] tracking-[0.2em] text-umber z-10">
        {number}
      </span>
      <div className="h-[55%] w-full overflow-hidden">
        <PlaceholderImage className="w-full h-full transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="absolute bottom-8 left-6 right-6">
        <h3 className="text-[1.5rem] transition-transform duration-[800ms] ease-out group-hover:-translate-y-1">
          {name}
        </h3>
      </div>
    </div>
  )
}

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      const overflow = trackRef.current.scrollWidth - window.innerWidth
      setScrollDistance(Math.max(overflow, 0))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance])

  return (
    <section id="services" className="bg-alabaster">
      <div className="px-6 md:px-12 pt-24 pb-10">
        <span className="text-[0.7rem] tracking-[0.2em] text-umber">WHAT WE DO</span>
      </div>

      {reduceMotion ? (
        <div className="flex flex-col px-6 md:px-12 pb-16 gap-px bg-umber">
          {services.map((service) => (
            <div key={service.number} className="bg-alabaster">
              <ServicePanel {...service} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="hidden md:block relative"
            style={{ height: `calc(100vh + ${scrollDistance}px)` }}
          >
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
              <motion.div ref={trackRef} className="flex" style={{ x }}>
                {services.map((service) => (
                  <ServicePanel key={service.number} {...service} />
                ))}
              </motion.div>
            </div>
          </div>

          <div className="md:hidden flex flex-col px-6 pb-16 gap-px bg-umber">
            {services.map((service) => (
              <div key={service.number} className="bg-alabaster">
                <ServicePanel {...service} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
