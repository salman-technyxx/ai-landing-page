import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { features } from '../../data/features'
import { Features } from './Features'
import { LogoStrip } from './LogoStrip'

test('features section renders one titled card per feature under an h2, in data order', () => {
  render(<Features />)

  const section = screen.getByRole('region', { name: /everything your team needs/i })
  expect(within(section).getByRole('heading', { level: 2 })).toBeInTheDocument()

  const titles = within(section)
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)
  expect(titles).toEqual(features.map((feature) => feature.title))
  expect(titles).toHaveLength(4)
})

test('feature icons are decorative (empty alt) so screen readers read only the titles', () => {
  const { container } = render(<Features />)
  const images = container.querySelectorAll('img')
  expect(images.length).toBeGreaterThan(0)
  images.forEach((img) => expect(img).toHaveAttribute('alt', ''))
})

test('logo strip is a labelled list of the six company names from the design', () => {
  render(<LogoStrip />)

  const section = screen.getByRole('region', { name: 'Trusted by modern teams' })
  const names = within(section)
    .getAllByRole('listitem')
    .map((item) => item.textContent)
  expect(names).toEqual(['Google', 'slack', 'Notion', 'Spotify', 'zoom', 'shopify'])
})
