export type FooterLink = {
  label: string
  href: string
}

// Exactly what the Figma footer contains: a logo, one copyright line, and Privacy / Terms / Security.
// The year is written as in the design.
export const footerCopyright = '© 2025 FlowPilot Inc. All rights reserved.'

// The project has no legal pages, so these are placeholders ('#').
export const legalLinks: FooterLink[] = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Security', href: '#' },
]
