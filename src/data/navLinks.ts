export type NavLink = {
  label: string
  href: string
}

// Anchor ids must match the `id` of each section component.
// Figma has no FAQ section, so "FAQ" points at the contact section (approved decision).
export const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#contact' },
]
