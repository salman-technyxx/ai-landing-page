import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  DEMO_TIME_TEAM_SIZE,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  NAME_MIN_LENGTH,
  SUBMIT_DELAY_MS,
  SUCCESS_MESSAGE,
  demoTimes,
  teamSizes,
} from '../../data/contact'
import type { DemoTime, TeamSize } from '../../data/contact'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { controlClass, errorId } from '../ui/formStyles'

type FormValues = {
  fullName: string
  email: string
  company: string
  teamSize: '' | TeamSize
  message: string
  terms: boolean
  demoTime?: '' | DemoTime
}

// What a successful submission produces. `demoTime` only exists when team size is 200+.
export type ContactSubmission = {
  fullName: string
  email: string
  company: string
  teamSize: TeamSize
  message: string
  demoTime?: DemoTime
}

type ContactFormProps = {
  // There is no backend; the page ignores this, tests use it to inspect what would be sent.
  onSubmitted?: (submission: ContactSubmission) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// Names and messages are validated after trimming, so "   " counts as empty.
const filled = (message: string) => (value: string) => value.trim() !== '' || message

export function ContactForm({ onSubmitted }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // Validate when the user submits, then re-check each field as they fix it.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { fullName: '', email: '', company: '', teamSize: '', message: '', terms: false },
  })
  const [submitted, setSubmitted] = useState(false)
  // Disabling the button is not enough: pressing Enter in a field can submit again.
  const inFlight = useRef(false)
  const successRef = useRef<HTMLParagraphElement>(null)

  // The form is replaced by the success message, which would drop keyboard focus to the page body.
  useEffect(() => {
    if (submitted) successRef.current?.focus()
  }, [submitted])

  const teamSize = useWatch({ control, name: 'teamSize' })
  const messageLength = useWatch({ control, name: 'message' }).length
  const showDemoTime = teamSize === DEMO_TIME_TEAM_SIZE

  const onValid = async (values: FormValues) => {
    if (inFlight.current) return
    inFlight.current = true
    await wait(SUBMIT_DELAY_MS) // simulated request

    const submission: ContactSubmission = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      teamSize: values.teamSize as TeamSize,
      message: values.message.trim(),
    }
    // The field is unregistered when hidden, so this is undefined unless team size is 200+.
    if (values.demoTime) submission.demoTime = values.demoTime

    onSubmitted?.(submission)
    setSubmitted(true)
    inFlight.current = false
  }

  const invalid = (name: keyof FormValues) => ({
    id: name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
  })

  return (
    <div>
      {/* Always in the page so screen readers announce the text when it appears. */}
      <div role="status">
        {submitted && (
          <p ref={successRef} tabIndex={-1} className="rounded-input bg-tint px-4 py-5 text-center text-base leading-6 font-semibold text-ink outline-none">
            {SUCCESS_MESSAGE}
          </p>
        )}
      </div>

      {!submitted && (
        <form onSubmit={(event) => handleSubmit(onValid)(event)} noValidate aria-busy={isSubmitting} className="grid gap-3.5 md:gap-5">
          <div className="grid gap-3.5 md:grid-cols-2 md:gap-5">
            <FormField id="fullName" label="Full Name" required error={errors.fullName?.message}>
              <input
                {...register('fullName', {
                  validate: {
                    required: filled('Please enter your full name.'),
                    minLength: (v) => v.trim().length >= NAME_MIN_LENGTH || `Full name must be at least ${NAME_MIN_LENGTH} characters.`,
                  },
                })}
                {...invalid('fullName')}
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                aria-required="true"
                className={`${controlClass(!!errors.fullName)} h-10`}
              />
            </FormField>

            <FormField id="email" label="Work Email" required error={errors.email?.message}>
              <input
                {...register('email', {
                  validate: {
                    required: filled('Please enter your work email.'),
                    format: (v) => EMAIL_PATTERN.test(v.trim()) || 'Please enter a valid email address.',
                  },
                })}
                {...invalid('email')}
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-required="true"
                className={`${controlClass(!!errors.email)} h-10`}
              />
            </FormField>

            <FormField id="company" label="Company Name" required error={errors.company?.message}>
              <input
                {...register('company', { validate: filled('Please enter your company name.') })}
                {...invalid('company')}
                type="text"
                autoComplete="organization"
                placeholder="Acme Inc."
                aria-required="true"
                className={`${controlClass(!!errors.company)} h-10`}
              />
            </FormField>

            <FormField id="teamSize" label="Team Size" required error={errors.teamSize?.message}>
              <div className="relative">
                <select
                  {...register('teamSize', { validate: (v) => v !== '' || 'Please select your team size.' })}
                  {...invalid('teamSize')}
                  aria-required="true"
                  className={`${controlClass(!!errors.teamSize)} h-10 appearance-none pr-10`}
                >
                  <option value="">Select team size</option>
                  {teamSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </FormField>

            {showDemoTime && (
              <FormField id="demoTime" label="Preferred Demo Time" required error={errors.demoTime?.message}>
                <div className="relative">
                  <select
                    {...register('demoTime', {
                      // Unregistering on unmount removes the value and the rule, so a hidden field never blocks submit.
                      shouldUnregister: true,
                      validate: (v) => !!v || 'Please choose a preferred demo time.',
                    })}
                    {...invalid('demoTime')}
                    defaultValue=""
                    aria-required="true"
                    className={`${controlClass(!!errors.demoTime)} h-10 appearance-none pr-10`}
                  >
                    <option value="">Select a time</option>
                    {demoTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </FormField>
            )}
          </div>

          {/* Mobile: counter sits on the label row (Figma). Desktop: inside the textarea, bottom right (Figma). */}
          <div className="grid grid-cols-[1fr_auto]">
            <label htmlFor="message" className="mb-1 block text-xs leading-[18px] font-medium text-ink md:mb-1.5 md:text-[13px] md:leading-[19.5px] md:font-semibold">
              Message<span aria-hidden="true"> *</span>
            </label>
            <p id="message-count" className="text-[11px] leading-[16.5px] text-muted md:z-10 md:col-span-2 md:col-start-1 md:row-start-2 md:mr-3 md:mb-2.5 md:self-end md:justify-self-end">
              {messageLength} / {MESSAGE_MAX_LENGTH}
            </p>
            <textarea
              {...register('message', {
                validate: {
                  required: filled('Please enter a message.'),
                  minLength: (v) => v.trim().length >= MESSAGE_MIN_LENGTH || `Message must be at least ${MESSAGE_MIN_LENGTH} characters.`,
                },
              })}
              id="message"
              maxLength={MESSAGE_MAX_LENGTH}
              placeholder="Tell us about your needs…"
              aria-required="true"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`message-count${errors.message ? ` ${errorId('message')}` : ''}`}
              className={`${controlClass(!!errors.message)} col-span-2 min-h-[94px] resize-y py-3 md:col-start-1 md:row-start-2 md:min-h-[78px]`}
            />
            {errors.message && (
              <p id={errorId('message')} className="col-span-2 mt-1 text-xs leading-[18px] text-danger md:row-start-3">
                {errors.message.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-start gap-2">
              <input
                {...register('terms', { validate: (v) => v || 'You must accept the Terms of Service and Privacy Policy.' })}
                {...invalid('terms')}
                type="checkbox"
                aria-required="true"
                className="mt-0.5 size-3.5 shrink-0 accent-brand-blue md:size-4"
              />
              <label htmlFor="terms" className="text-[11px] leading-[16.5px] text-muted">
                I agree to the{' '}
                {/* No legal pages exist in this project, so these links go nowhere (placeholders). */}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-brand-blue underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-brand-blue underline">
                  Privacy Policy
                </a>
                <span aria-hidden="true"> *</span>
              </label>
            </div>
            {errors.terms && (
              <p id={errorId('terms')} className="mt-1 text-xs leading-[18px] text-danger">
                {errors.terms.message}
              </p>
            )}
          </div>

          <Button type="submit" size="sm" disabled={isSubmitting} className="mt-1 w-full">
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  )
}
