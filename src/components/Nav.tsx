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
      {/* Desktop: single-line wordmark (Original: 3-line stacked text-[0.8rem]) */}
      <span className="hidden md:inline spaced-caps text-[1.25rem] tracking-[0.16em] whitespace-nowrap">
        THE PLUMING TALES COMPANY
      </span>

      {/* Mobile: single-line mark (Original: text-[0.8rem]) */}
      <span className="md:hidden spaced-caps text-[1.08rem] tracking-[0.12em] whitespace-nowrap">
        PLUMING TALES
      </span>

      <nav className="flex items-center gap-5 md:gap-8">
        {navLinks.map(({ label, href }) => (
          <a key={label} href={href} className="nav-link spaced-caps text-[0.88rem] md:text-[0.92rem]">
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
