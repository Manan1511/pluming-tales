import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import logo from '../assets/logo.svg'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock background scroll while the mobile menu overlay is open.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 transition-colors duration-500 ${
        // backdrop-blur-sm uses backdrop-filter, which creates a new CSS
        // containing block for position:fixed descendants — that would size
        // the full-screen mobile overlay below against this 64px header
        // instead of the viewport. Never apply blur while the menu is open.
        menuOpen ? 'bg-alabaster' : scrolled ? 'bg-alabaster/92 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <button
        onClick={() => {
          setMenuOpen(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className="text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-umber"
        aria-label="Scroll to top"
      >
        <img src={logo} alt="The Pluming Tales Company" className="h-9 lg:h-11 w-auto" />
      </button>

      <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map(({ label, href }) => (
          <a key={label} href={href} className="nav-link spaced-caps text-[0.92rem]">
            {label}
          </a>
        ))}
      </nav>

      {/* Mobile: hamburger, morphs into an X while the menu is open. */}
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="lg:hidden relative z-10 h-8 w-8 flex flex-col items-center justify-center gap-[6px] cursor-pointer"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span
          className={`block h-px w-6 bg-onyx transition-transform duration-300 ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}
        />
        <span
          className={`block h-px w-6 bg-onyx transition-transform duration-300 ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`}
        />
      </button>

      {/* Mobile menu overlay: fully opaque, or hero content behind it
          bleeds through and jumbles with the nav links. */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-alabaster transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-start gap-8 px-6 pt-12">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="nav-link spaced-caps text-[1.4rem]"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
