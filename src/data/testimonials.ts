export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
}

// Only the first testimonial is in the Figma design. The other two are fictional placeholders
// (made-up names and companies, no measurable claims) so the slider has something to switch between.
export const testimonials: Testimonial[] = [
  {
    id: 'jessica-lee',
    quote:
      'FlowPilot has completely changed how our team works. We’re more organized, more productive, and spend less time on repetitive tasks.',
    name: 'Jessica Lee',
    role: 'Product Manager, Acme Inc.',
  },
  {
    id: 'daniel-okoye',
    quote: 'The AI suggestions are genuinely useful. Our weekly planning feels calmer and everyone knows what comes next.',
    name: 'Daniel Okoye',
    role: 'Engineering Manager, Brightwave Labs',
  },
  {
    id: 'priya-nair',
    quote: 'Automating the repetitive handoffs gave us time back, and it is easy to see where every project stands.',
    name: 'Priya Nair',
    role: 'Operations Lead, Northfield Studio',
  },
]
