import { useEffect, useRef } from 'react'
import { navLinks } from '../../data/navLinks'
import { Button } from '../ui/Button'
import { ignorePlaceholder } from '../ui/placeholderLink'
import { Logo } from './Logo'

type MobileMenuProps = {
  id: string
  open: boolean
  onClose: () => void
  // Called when a link to a page section is chosen; closes without moving focus.
  onNavigate: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled])'

// The panel slides in from the right and back out. It stays mounted so it can animate out, and while
// closed it is `inert` + `aria-hidden` (not focusable, not announced, not clickable) and `invisible`.
// Tailwind v4 animates the `translate` property (not `transform`). `visibility` flips immediately when
// opening but only after the slide finishes when closing, so a closed menu never covers the page.
// With prefers-reduced-motion the transition is removed and the menu appears and disappears at once.
const PANEL_OPEN = 'visible translate-x-0 [transition:translate_300ms_ease-out,visibility_0s_linear_0s]'
const PANEL_CLOSED = 'invisible translate-x-full [transition:translate_300ms_ease-in,visibility_0s_linear_300ms]'

// Full-screen menu.
export function MobileMenu({ id, open, onClose, onNavigate }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    // Stop the page behind the menu from scrolling while it is open.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    // Keep Tab / Shift+Tab inside the menu while it is open.
    const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (!items || items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      aria-hidden={!open}
      inert={!open}
      onKeyDown={handleKeyDown}
      className={`fixed inset-0 z-50 flex flex-col bg-white motion-reduce:[transition:none] md:hidden ${open ? PANEL_OPEN : PANEL_CLOSED}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-divider px-5">
        <Logo />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-10 items-center justify-center rounded-full border border-line text-ink hover:bg-surface"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-5 py-4">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href} className="border-b border-divider">
              {/* Selecting a link closes the menu; the browser then scrolls to the anchor. */}
              <a
                href={link.href}
                onClick={onNavigate}
                className="flex items-center justify-between py-4 text-base font-medium text-ink hover:text-brand-blue"
              >
                {link.label === 'FAQ' ? 'FAQ & Contact' : link.label}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 text-subtle" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-3 border-t border-divider p-5">
        <Button
          variant="outline"
          href="#"
          onClick={(event) => {
            ignorePlaceholder(event)
            onClose()
          }}
        >
          Log In
        </Button>
        <Button href="#contact" onClick={onNavigate}>
          Get Started
        </Button>
      </div>
    </div>
  )
}
