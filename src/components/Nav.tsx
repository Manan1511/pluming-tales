import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 transition-colors duration-500 ${
        scrolled ? 'bg-alabaster/92 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      {/* Desktop: three-line stacked wordmark */}
      <div className="hidden md:flex flex-col items-start leading-none">
        <span className="spaced-caps text-[0.8rem]">THE</span>
        <span className="spaced-caps text-[0.8rem] mt-1">PLUMING TALES</span>
        <span className="w-[60%] h-px bg-umber/70 mt-1 self-center" />
        <span className="spaced-caps text-[0.8rem] mt-1">COMPANY</span>
      </div>

      {/* Mobile: single-line mark, no hamburger */}
      <span className="md:hidden spaced-caps text-[0.8rem]">PLUMING TALES</span>

      <nav className="flex items-center gap-5 md:gap-8">
        {navLinks.map(({ label, href }) => (
          <a key={label} href={href} className="nav-link spaced-caps text-[0.78rem] md:text-[0.8rem]">
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
