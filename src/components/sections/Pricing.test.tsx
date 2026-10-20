import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { plans } from '../../data/plans'
import { Pricing } from './Pricing'

test('renders Starter, Pro and Business with monthly prices and their features', () => {
  render(<Pricing />)

  const expected = [
    { name: 'Starter', price: '$0', feature: 'Community support' },
    { name: 'Pro', price: '$19', feature: 'Priority support' },
    { name: 'Business', price: '$49', feature: 'Dedicated support' },
  ]
  for (const { name, price, feature } of expected) {
    const card = screen.getByRole('article', { name })
    expect(within(card).getByRole('heading', { level: 3, name })).toBeInTheDocument()
    expect(within(card).getByText(price)).toBeInTheDocument()
    expect(within(card).getByText('/month')).toBeInTheDocument()
    expect(within(card).getByText(feature)).toBeInTheDocument()
  }
  expect(screen.getAllByRole('article')).toHaveLength(plans.length)
})

test('only Pro is marked Most Popular, and there is no yearly toggle', () => {
  render(<Pricing />)

  expect(screen.getAllByText('Most Popular')).toHaveLength(1)
  expect(within(screen.getByRole('article', { name: 'Pro' })).getByText('Most Popular')).toBeInTheDocument()
  expect(screen.queryByText(/yearly/i)).not.toBeInTheDocument()
})

test('each Get Started button has a distinct accessible name and links to the contact form', () => {
  render(<Pricing />)

  for (const name of ['Starter', 'Pro', 'Business']) {
    const link = screen.getByRole('link', { name: `Get Started with ${name}` })
    expect(link).toHaveAttribute('href', '#contact')
    expect(link).toHaveTextContent('Get Started')
  }
})
