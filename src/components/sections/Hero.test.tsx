import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Hero } from './Hero'

test('hero shows the headline, two CTAs that link to page sections, and the trust notes', () => {
  render(<Hero />)

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Work smarter.')
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Let AI handle the repetitive work.')

  expect(screen.getByRole('link', { name: 'Start Free' })).toHaveAttribute('href', '#contact')
  expect(screen.getByRole('link', { name: 'See How It Works' })).toHaveAttribute('href', '#how-it-works')

  for (const note of ['No credit card required', 'Set up in minutes', 'Trusted by 10,000+ teams']) {
    expect(screen.getByText(note)).toBeInTheDocument()
  }
})

test('dashboard mock is exposed as a single labelled image, not as stray text', () => {
  render(<Hero />)
  expect(screen.getByRole('img', { name: /FlowPilot dashboard preview/ })).toBeInTheDocument()
})
