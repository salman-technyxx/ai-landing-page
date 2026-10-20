import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UserEvent } from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { SUCCESS_MESSAGE } from '../../data/contact'
import { ContactForm } from './ContactForm'

const VALID_MESSAGE = 'We would like to see how FlowPilot fits our team.'

const field = {
  name: () => screen.getByLabelText(/^Full Name/),
  email: () => screen.getByLabelText(/^Work Email/),
  company: () => screen.getByLabelText(/^Company Name/),
  teamSize: () => screen.getByLabelText(/^Team Size/),
  message: () => screen.getByLabelText(/^Message/),
  terms: () => screen.getByRole('checkbox'),
  demoTime: () => screen.getByLabelText(/^Preferred Demo Time/),
  submit: () => screen.getByRole('button', { name: /Send Message|Sending/ }),
}

async function fillValid(user: UserEvent, teamSize = '11-50') {
  await user.type(field.name(), 'Jane Smith')
  await user.type(field.email(), 'jane@company.com')
  await user.type(field.company(), 'Acme Inc.')
  await user.selectOptions(field.teamSize(), teamSize)
  await user.type(field.message(), VALID_MESSAGE)
  await user.click(field.terms())
}

const submittedOnce = (onSubmitted: ReturnType<typeof vi.fn>) =>
  vi.waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1), { timeout: 3000 })

test('an empty form cannot be submitted and shows an error for every required field', async () => {
  const user = userEvent.setup()
  const onSubmitted = vi.fn()
  render(<ContactForm onSubmitted={onSubmitted} />)

  await user.click(field.submit())

  expect(screen.getByText('Please enter your full name.')).toBeInTheDocument()
  expect(screen.getByText('Please enter your work email.')).toBeInTheDocument()
  expect(screen.getByText('Please enter your company name.')).toBeInTheDocument()
  expect(screen.getByText('Please select your team size.')).toBeInTheDocument()
  expect(screen.getByText('Please enter a message.')).toBeInTheDocument()
  expect(screen.getByText(/You must accept the Terms of Service/)).toBeInTheDocument()

  expect(onSubmitted).not.toHaveBeenCalled()
  expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument()
  // The first invalid field gets focus, and errors are tied to their fields for screen readers.
  expect(field.name()).toHaveFocus()
  expect(field.name()).toHaveAttribute('aria-invalid', 'true')
  expect(field.name()).toHaveAccessibleDescription('Please enter your full name.')
})

test('each field enforces its rule, trimming whitespace first', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)

  await user.type(field.name(), '  ab ') // 2 characters once trimmed
  await user.type(field.email(), 'not-an-email')
  await user.type(field.company(), '   ') // only spaces
  await user.type(field.message(), 'too short') // 9 characters
  await user.click(field.submit())

  expect(screen.getByText('Full name must be at least 3 characters.')).toBeInTheDocument()
  expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
  expect(screen.getByText('Please enter your company name.')).toBeInTheDocument()
  expect(screen.getByText('Message must be at least 20 characters.')).toBeInTheDocument()

  // Errors are re-checked as the user types (validate on submit, then on change).
  await user.clear(field.name())
  await user.type(field.name(), 'Abe')
  expect(screen.queryByText('Full name must be at least 3 characters.')).not.toBeInTheDocument()
})

test('Team Size 200+ shows a required Preferred Demo Time that blocks submit until chosen', async () => {
  const user = userEvent.setup()
  const onSubmitted = vi.fn()
  render(<ContactForm onSubmitted={onSubmitted} />)

  expect(screen.queryByLabelText(/^Preferred Demo Time/)).not.toBeInTheDocument()
  await fillValid(user, '200+')

  const demoTime = field.demoTime()
  expect(demoTime).toBeRequired()
  expect(Array.from((demoTime as HTMLSelectElement).options).map((o) => o.text)).toEqual(['Select a time', 'Morning', 'Afternoon', 'Evening'])

  await user.click(field.submit())
  expect(screen.getByText('Please choose a preferred demo time.')).toBeInTheDocument()
  expect(onSubmitted).not.toHaveBeenCalled()

  await user.selectOptions(demoTime, 'Morning')
  expect(screen.queryByText('Please choose a preferred demo time.')).not.toBeInTheDocument()

  await user.click(field.submit())
  await submittedOnce(onSubmitted)
  expect(onSubmitted).toHaveBeenCalledWith(expect.objectContaining({ teamSize: '200+', demoTime: 'Morning' }))
})

test('changing Team Size away from 200+ removes Preferred Demo Time and it no longer blocks submit', async () => {
  const user = userEvent.setup()
  const onSubmitted = vi.fn()
  render(<ContactForm onSubmitted={onSubmitted} />)

  await fillValid(user, '200+')
  await user.selectOptions(field.demoTime(), 'Evening') // a value exists that must not leak after switching away

  await user.selectOptions(field.teamSize(), '11-50')
  expect(screen.queryByLabelText(/^Preferred Demo Time/)).not.toBeInTheDocument()

  // Coming back to 200+ starts from an empty choice, not the old "Evening".
  await user.selectOptions(field.teamSize(), '200+')
  expect(field.demoTime()).toHaveValue('')

  await user.selectOptions(field.teamSize(), '11-50')
  await user.click(field.submit())
  await submittedOnce(onSubmitted)

  const submission = onSubmitted.mock.calls[0][0]
  expect(submission.teamSize).toBe('11-50')
  expect('demoTime' in submission).toBe(false) // the hidden field's value is not sent
  expect(screen.queryByText('Please choose a preferred demo time.')).not.toBeInTheDocument()
})

test('shows a live "N / 300" counter and never accepts more than 300 characters', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)
  const message = field.message() as HTMLTextAreaElement

  expect(screen.getByText('0 / 300')).toBeInTheDocument()
  await user.type(message, 'Hello')
  expect(screen.getByText('5 / 300')).toBeInTheDocument()

  await user.clear(message)
  await user.click(message)
  await user.paste('a'.repeat(310))
  expect(message.value).toHaveLength(300)
  expect(screen.getByText('300 / 300')).toBeInTheDocument()
})

test('submitting disables the button, shows a sending state, ignores repeats, then shows the exact success message', async () => {
  const user = userEvent.setup()
  const onSubmitted = vi.fn()
  const { container } = render(<ContactForm onSubmitted={onSubmitted} />)

  await fillValid(user)
  await user.click(field.submit())

  const sending = screen.getByRole('button', { name: 'Sending…' })
  expect(sending).toBeDisabled()
  expect(container.querySelector('form')).toHaveAttribute('aria-busy', 'true')

  // Repeat attempts while the request is in flight: submit the form again directly (as Enter would).
  fireEvent.submit(container.querySelector('form')!)
  fireEvent.submit(container.querySelector('form')!)

  expect(await screen.findByText(SUCCESS_MESSAGE, {}, { timeout: 3000 })).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent(/^Thanks! Our team will contact you shortly\.$/)
  expect(screen.queryByRole('button', { name: /Send Message|Sending/ })).not.toBeInTheDocument()
  // Repeated submits would have started a few milliseconds after the first, so give them time to land.
  await new Promise((resolve) => setTimeout(resolve, 250))
  expect(onSubmitted).toHaveBeenCalledTimes(1)
  expect(onSubmitted).toHaveBeenCalledWith({
    fullName: 'Jane Smith',
    email: 'jane@company.com',
    company: 'Acme Inc.',
    teamSize: '11-50',
    message: VALID_MESSAGE,
  })
})
