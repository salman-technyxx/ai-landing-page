import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'

// Smoke test for the test toolchain only; it does not test any app code.
function Toggle() {
  const [on, setOn] = useState(false)
  return (
    <button type="button" aria-pressed={on} onClick={() => setOn(!on)}>
      {on ? 'On' : 'Off'}
    </button>
  )
}

test('test setup renders, handles user events, and supports jest-dom matchers', async () => {
  const user = userEvent.setup()
  render(<Toggle />)

  const button = screen.getByRole('button', { name: 'Off' })
  expect(button).toHaveAttribute('aria-pressed', 'false')

  await user.click(button)
  expect(screen.getByRole('button', { name: 'On' })).toHaveAttribute('aria-pressed', 'true')
})
