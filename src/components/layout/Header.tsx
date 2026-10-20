import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../../data/navLinks'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { ignorePlaceholder } from '../ui/placeholderLink'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'

const MENU_ID = 'mobile-menu'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Escape / the close button return focus to the hamburger that opened the menu.
  const closeMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  // Choosing a link closes the menu but leaves focus alone, so the browser's jump to the anchor
  // is not undone by focus going back to the hamburger at the top of the page.
  const closeMenuOnNavigate = () => setMenuOpen(false)

  // If the window grows to the desktop layout while the menu is open (rotating a tablet, resizing),
  // close it so the page is not left scroll-locked behind a menu that is no longer shown.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const desktop = window.matchMedia('(min-width: 768px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    desktop.addEventListener('change', handleChange)
    return () => desktop.removeEventListener('change', handleChange)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-white">
      <Container className="flex h-16 items-center justify-between md:h-[76px]">
        <Logo href="#top" />

        {/* Desktop navigation: from 768px up. Below that the hamburger menu is used.
            Gaps are tighter from 768px to 1023px so the five links, Log In and Get Started fit. */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-4 lg:gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-[13px] font-medium text-muted transition hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <a href="#" onClick={ignorePlaceholder} className="text-[13px] font-semibold text-ink hover:text-brand-blue">
            Log In
          </a>
          <Button href="#contact" size="header" className="w-[150px]">
            Get Started
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          className="flex size-10 items-center justify-center rounded-button border border-line text-ink hover:bg-surface md:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </Container>

      <MobileMenu id={MENU_ID} open={menuOpen} onClose={closeMenu} onNavigate={closeMenuOnNavigate} />
    </header>
  )
}
