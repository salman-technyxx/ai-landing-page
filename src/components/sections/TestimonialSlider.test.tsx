import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import type { Testimonial } from '../../data/testimonials'
import { TestimonialSlider } from './TestimonialSlider'

const items: Testimonial[] = [
  { id: 'a', quote: 'First quote', name: 'Ada Example', role: 'Role A' },
  { id: 'b', quote: 'Second quote', name: 'Ben Example', role: 'Role B' },
  { id: 'c', quote: 'Third quote', name: 'Cy Example', role: 'Role C' },
]

const activeDots = () => screen.getAllByRole('button', { name: /Show testimonial/ }).filter((dot) => dot.getAttribute('aria-current') === 'true')

test('shows the first testimonial with the first indicator active', () => {
  const { container } = render(<TestimonialSlider testimonials={items} />)

  // Guards against encoding damage to the decorative quote mark and stars (seen once as "â€œ").
  expect(container).toHaveTextContent('“')
  expect(container).toHaveTextContent('★★★★★')

  expect(screen.getByText('First quote')).toBeInTheDocument()
  expect(screen.getByText('Ada Example')).toBeInTheDocument()
  expect(screen.queryByText('Second quote')).not.toBeInTheDocument()
  expect(screen.getByRole('group', { name: '1 of 3' })).toBeInTheDocument()
  expect(activeDots()).toHaveLength(1)
  expect(activeDots()[0]).toHaveAccessibleName('Show testimonial 1 of 3')
})

test('next and previous move through the testimonials and wrap around at both ends', async () => {
  const user = userEvent.setup()
  render(<TestimonialSlider testimonials={items} />)
  const next = screen.getByRole('button', { name: 'Next testimonial' })
  const previous = screen.getByRole('button', { name: 'Previous testimonial' })

  await user.click(next)
  expect(screen.getByText('Second quote')).toBeInTheDocument()
  expect(screen.queryByText('First quote')).not.toBeInTheDocument()

  await user.click(next)
  expect(screen.getByText('Third quote')).toBeInTheDocument()

  await user.click(next) // wraps from the last to the first
  expect(screen.getByText('First quote')).toBeInTheDocument()

  await user.click(previous) // wraps from the first to the last
  expect(screen.getByText('Third quote')).toBeInTheDocument()
  expect(screen.getByText('Cy Example')).toBeInTheDocument()

  await user.click(previous)
  expect(screen.getByText('Second quote')).toBeInTheDocument()
})

test('the active indicator follows the current slide, and clicking an indicator jumps to it', async () => {
  const user = userEvent.setup()
  render(<TestimonialSlider testimonials={items} />)

  await user.click(screen.getByRole('button', { name: 'Next testimonial' }))
  expect(activeDots()).toHaveLength(1)
  expect(activeDots()[0]).toHaveAccessibleName('Show testimonial 2 of 3')
  expect(screen.getByRole('group', { name: '2 of 3' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Show testimonial 3 of 3' }))
  expect(screen.getByText('Third quote')).toBeInTheDocument()
  expect(activeDots()[0]).toHaveAccessibleName('Show testimonial 3 of 3')
})

test('controls have distinct accessible names and the slider renders nothing without data', () => {
  const { container, rerender } = render(<TestimonialSlider testimonials={items} />)
  expect(screen.getByRole('button', { name: 'Previous testimonial' })).not.toBe(screen.getByRole('button', { name: 'Next testimonial' }))

  rerender(<TestimonialSlider testimonials={[]} />)
  expect(container).toBeEmptyDOMElement()
})

// --- slide animation -------------------------------------------------------------------------------------
// The test DOM has no CSS, so these check the classes and the outgoing copy, not pixels.
afterEach(() => vi.unstubAllGlobals())

const stubMotion = (allowed: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: allowed, media: query, addEventListener: () => {}, removeEventListener: () => {} }))

const outgoingFigure = (container: HTMLElement) => container.querySelector('[aria-hidden="true"] figure')
const incomingFigure = (container: HTMLElement) => container.querySelector('figure:not([aria-hidden="true"] figure)')

test('Next slides the old card out to the left and the new card in from the right, then removes the old copy', async () => {
  stubMotion(true)
  const user = userEvent.setup()
  const { container } = render(<TestimonialSlider testimonials={items} />)

  await user.click(screen.getByRole('button', { name: 'Next testimonial' }))

  expect(outgoingFigure(container)).toHaveTextContent('First quote')
  expect(outgoingFigure(container)).toHaveClass('animate-slide-out-left')
  expect(incomingFigure(container)).toHaveTextContent('Second quote')
  expect(incomingFigure(container)).toHaveClass('animate-slide-in-right')
  // The outgoing copy is decoration: not exposed to screen readers and not clickable.
  expect(outgoingFigure(container)!.parentElement).toHaveAttribute('inert')

  await waitFor(() => expect(outgoingFigure(container)).toBeNull(), { timeout: 2000 })
  expect(screen.getByText('Second quote')).toBeInTheDocument()
})

test('Previous slides the other way: new card in from the left, old card out to the right', async () => {
  stubMotion(true)
  const user = userEvent.setup()
  const { container } = render(<TestimonialSlider testimonials={items} />)

  await user.click(screen.getByRole('button', { name: 'Previous testimonial' })) // wraps to the last slide

  expect(outgoingFigure(container)).toHaveTextContent('First quote')
  expect(outgoingFigure(container)).toHaveClass('animate-slide-out-right')
  expect(incomingFigure(container)).toHaveTextContent('Third quote')
  expect(incomingFigure(container)).toHaveClass('animate-slide-in-left')
})

test('navigation is ignored while a slide is still moving, so cards never jump mid-animation', async () => {
  stubMotion(true)
  const user = userEvent.setup()
  render(<TestimonialSlider testimonials={items} />)

  await user.click(screen.getByRole('button', { name: 'Next testimonial' }))
  await user.click(screen.getByRole('button', { name: 'Next testimonial' })) // too soon: ignored

  expect(screen.getByText('Second quote')).toBeInTheDocument()
  expect(screen.queryByText('Third quote')).not.toBeInTheDocument()

  await waitFor(() => expect(document.querySelector('[aria-hidden="true"] figure')).toBeNull(), { timeout: 2000 })
  await user.click(screen.getByRole('button', { name: 'Next testimonial' })) // after the slide: works
  expect(screen.getByText('Third quote')).toBeInTheDocument()
})

test('with reduced motion the card changes instantly, with no outgoing copy and no animation classes', async () => {
  stubMotion(false)
  const user = userEvent.setup()
  const { container } = render(<TestimonialSlider testimonials={items} />)

  await user.click(screen.getByRole('button', { name: 'Next testimonial' }))

  expect(outgoingFigure(container)).toBeNull()
  expect(incomingFigure(container)).toHaveTextContent('Second quote')
  expect(incomingFigure(container)!.className).not.toMatch(/animate-slide-in/)
})
