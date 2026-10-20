import { useEffect, useState } from 'react'
import type { Testimonial } from '../../data/testimonials'

type TestimonialSliderProps = {
  testimonials: Testimonial[]
}

type Direction = 'next' | 'prev'

// Must be a little longer than the 450ms slide animation in index.css.
const SLIDE_MS = 500

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  )
}

const arrowButton =
  'flex size-[42px] shrink-0 items-center justify-center rounded-button border border-line bg-white text-ink transition hover:border-brand-blue hover:text-brand-blue'

// Users who ask for reduced motion (and environments without matchMedia, like the test DOM) get an instant swap.
const canAnimate = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: no-preference)').matches

type TestimonialCardProps = {
  testimonial: Testimonial
  label: string
  // Fills the slide area (used for the outgoing copy while it slides away).
  fill?: boolean
  className?: string
}

function TestimonialCard({ testimonial, label, fill = false, className = '' }: TestimonialCardProps) {
  return (
    <figure
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      className={`relative flex min-h-[220px] flex-col justify-between rounded-[18px] bg-soft p-5 md:border md:border-line md:bg-none md:bg-white md:p-[33px] md:shadow-soft ${fill ? 'h-full' : ''} ${className}`}
    >
      <span aria-hidden="true" className="block h-10 text-[44px] leading-[44px] font-bold text-brand-violet md:absolute md:top-4 md:left-6 md:h-auto md:text-[54px] md:leading-[54px]">
        {'“'}
      </span>
      <blockquote className="text-sm leading-[19px] font-medium text-ink md:pt-2 md:pl-7 md:text-lg md:leading-[24.3px]">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-4 flex items-center justify-between md:pl-7">
        <span>
          <span className="block text-xs leading-[18px] font-bold text-ink md:text-[13px] md:leading-[19.5px]">{testimonial.name}</span>
          <span className="block text-[10px] leading-[15px] text-muted md:text-[11px] md:leading-[16.5px]">{testimonial.role}</span>
        </span>
        {/* Figma shows the stars on desktop only. */}
        <span className="hidden text-sm leading-[21px] tracking-[1.4px] text-star md:block">
          <span aria-hidden="true">{'★'.repeat(5)}</span>
          <span className="sr-only">Rated 5 out of 5</span>
        </span>
      </figcaption>
    </figure>
  )
}

// The current slide is just an index into the data. Previous/next wrap around at the ends.
// On a change the new card slides in (from the right when going forward, from the left when going back)
// while a copy of the old card slides out the other way. `leaving` holds that copy only during the slide.
export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<Direction | null>(null)
  const [leaving, setLeaving] = useState<Testimonial | null>(null)
  const count = testimonials.length

  // Remove the outgoing copy once the slide has finished.
  useEffect(() => {
    if (!leaving) return
    const timer = setTimeout(() => setLeaving(null), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [leaving])

  if (count === 0) return null

  const current = testimonials[index]

  const goTo = (target: number, way: Direction) => {
    if (target === index || leaving) return // ignore clicks while a slide is still moving
    if (canAnimate()) {
      setDirection(way)
      setLeaving(current)
    } else {
      setDirection(null)
    }
    setIndex(target)
  }

  const previous = () => goTo(index === 0 ? count - 1 : index - 1, 'prev')
  const next = () => goTo(index === count - 1 ? 0 : index + 1, 'next')

  const enter = direction === 'next' ? 'animate-slide-in-right' : direction === 'prev' ? 'animate-slide-in-left' : ''
  const leave = direction === 'next' ? 'animate-slide-out-left' : 'animate-slide-out-right'

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      // Mobile: card, then a controls row beneath it. From 1280px: previous | card | next, dots under the card.
      className="mt-8 grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-5 xl:mt-0 xl:grid-cols-[42px_557px_42px] xl:gap-x-4"
    >
      {/* Persistent live region, so a change is announced even though the card element is replaced.
          Horizontal overflow is clipped so the sliding cards never widen the page; the 12px side padding
          keeps the card's shadow from being cut off. */}
      <div
        aria-live="polite"
        className="relative col-span-3 -mx-3 overflow-x-clip px-3 xl:col-span-1 xl:col-start-2 xl:row-start-1"
      >
        {leaving && (
          // The outgoing copy is decoration for the animation: hidden from assistive tech and not clickable.
          <div aria-hidden="true" inert className="absolute inset-y-0 right-3 left-3">
            <TestimonialCard testimonial={leaving} label="previous testimonial" fill className={`${leave} motion-reduce:animate-none`} />
          </div>
        )}
        <TestimonialCard
          key={current.id}
          testimonial={current}
          label={`${index + 1} of ${count}`}
          className={`${enter} motion-reduce:animate-none`}
        />
      </div>

      <button type="button" onClick={previous} aria-label="Previous testimonial" className={`${arrowButton} xl:col-start-1 xl:row-start-1`}>
        <Chevron direction="left" />
      </button>

      <div className="flex justify-center gap-2 xl:col-start-2 xl:row-start-2">
        {testimonials.map((testimonial, i) => (
          <button
            key={testimonial.id}
            type="button"
            onClick={() => goTo(i, i > index ? 'next' : 'prev')}
            aria-label={`Show testimonial ${i + 1} of ${count}`}
            aria-current={i === index ? 'true' : undefined}
            className="group flex size-6 items-center justify-center"
          >
            <span
              className={`h-2 rounded-full transition-all duration-200 motion-reduce:transition-none ${
                i === index ? 'w-6 bg-brand' : 'w-2 bg-line group-hover:bg-subtle'
              }`}
            />
          </button>
        ))}
      </div>

      <button type="button" onClick={next} aria-label="Next testimonial" className={`${arrowButton} xl:col-start-3 xl:row-start-1`}>
        <Chevron direction="right" />
      </button>
    </div>
  )
}
