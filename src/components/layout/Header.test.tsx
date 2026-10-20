import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { Header } from './Header'

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.style.overflow = ''
})

const menuElement = () => document.getElementById('mobile-menu')!

test('mobile menu opens, lists every link, and closes when a link is selected', async () => {
  const user = userEvent.setup()
  render(<Header />)

  const openButton = screen.getByRole('button', { name: 'Open menu' })
  expect(openButton).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  await user.click(openButton)
  const menu = screen.getByRole('dialog', { name: 'Main menu' })
  expect(openButton).toHaveAttribute('aria-expanded', 'true')
  for (const name of ['Features', 'How It Works', 'Pricing', 'Testimonials', 'FAQ & Contact']) {
    expect(within(menu).getByRole('link', { name })).toBeInTheDocument()
  }

  await user.click(within(menu).getByRole('link', { name: 'Pricing' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('mobile menu closes with Escape and returns focus to the menu button', async () => {
  const user = userEvent.setup()
  render(<Header />)

  const openButton = screen.getByRole('button', { name: 'Open menu' })
  await user.click(openButton)
  expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()

  await user.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(openButton).toHaveFocus()
})

test('the closed menu stays in the page for its slide animation but is hidden, inert and off-screen', async () => {
  const user = userEvent.setup()
  render(<Header />)

  // Closed: not focusable, not announced, translated fully off to the right.
  expect(menuElement()).toHaveAttribute('aria-hidden', 'true')
  expect(menuElement()).toHaveAttribute('inert')
  expect(menuElement()).toHaveClass('invisible', 'translate-x-full')

  await user.click(screen.getByRole('button', { name: 'Open menu' }))
  expect(menuElement()).toHaveAttribute('aria-hidden', 'false')
  expect(menuElement()).not.toHaveAttribute('inert')
  expect(menuElement()).toHaveClass('visible', 'translate-x-0')

  await user.keyboard('{Escape}')
  expect(menuElement()).toHaveAttribute('aria-hidden', 'true')
  expect(menuElement()).toHaveAttribute('inert')
  expect(menuElement()).toHaveClass('invisible', 'translate-x-full')
})

test('the page behind the menu cannot scroll while it is open, and scrolling returns after it closes', async () => {
  const user = userEvent.setup()
  render(<Header />)
  expect(document.body.style.overflow).toBe('')

  await user.click(screen.getByRole('button', { name: 'Open menu' }))
  expect(document.body.style.overflow).toBe('hidden')

  await user.click(screen.getByRole('button', { name: 'Close menu' }))
  expect(document.body.style.overflow).toBe('')
})

test('growing to the desktop layout while the menu is open closes it and unlocks scrolling', async () => {
  const user = userEvent.setup()
  const listeners: Array<(event: { matches: boolean }) => void> = []
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.push(listener),
    removeEventListener: () => {},
  }))
  render(<Header />)

  const openButton = screen.getByRole('button', { name: 'Open menu' })
  await user.click(openButton)
  expect(openButton).toHaveAttribute('aria-expanded', 'true')
  expect(document.body.style.overflow).toBe('hidden')

  act(() => listeners.forEach((listener) => listener({ matches: true }))) // viewport reaches 768px
  expect(openButton).toHaveAttribute('aria-expanded', 'false')
  expect(document.body.style.overflow).toBe('')
  expect(menuElement()).toHaveAttribute('aria-hidden', 'true')
})
