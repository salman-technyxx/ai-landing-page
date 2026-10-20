import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Footer } from './Footer'

test('footer is the Figma footer: logo, copyright and exactly Privacy, Terms and Security', () => {
  render(<Footer />)

  const footer = screen.getByRole('contentinfo')
  expect(within(footer).getByRole('link', { name: 'FlowPilot' })).toHaveAttribute('href', '#top')
  expect(within(footer).getByText('© 2025 FlowPilot Inc. All rights reserved.')).toBeInTheDocument()

  const legal = within(footer).getByRole('navigation', { name: 'Legal' })
  expect(within(legal).getAllByRole('link').map((link) => link.textContent)).toEqual(['Privacy', 'Terms', 'Security'])

  // Four links in total: the logo link plus the three legal links. Nothing else.
  expect(within(footer).getAllByRole('link')).toHaveLength(4)
})

test('footer has no extra content beyond the design: no link columns, description or social links', () => {
  render(<Footer />)

  const footer = screen.getByRole('contentinfo')
  expect(within(footer).queryAllByRole('heading')).toHaveLength(0)
  expect(within(footer).queryByText(/Product|Company/)).not.toBeInTheDocument()
  expect(within(footer).queryByText(/LinkedIn|GitHub|FlowPilot helps modern teams/)).not.toBeInTheDocument()
  expect(within(footer).queryByRole('navigation', { name: /Social|Footer/ })).not.toBeInTheDocument()
})

test('placeholder links do not navigate (no jump to the top of the page)', () => {
  render(<Footer />)

  for (const name of ['Privacy', 'Terms', 'Security']) {
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    screen.getByRole('link', { name }).dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
  }

  // The logo link is a real in-page link and is not blocked.
  const logoClick = new MouseEvent('click', { bubbles: true, cancelable: true })
  screen.getByRole('link', { name: 'FlowPilot' }).dispatchEvent(logoClick)
  expect(logoClick.defaultPrevented).toBe(false)
})
