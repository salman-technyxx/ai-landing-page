import checkIcon from '../../assets/icons/check.svg'
import type { Plan } from '../../data/plans'
import { Button } from '../ui/Button'

export function PricingCard({ plan }: { plan: Plan }) {
  const { id, name, price, tagline, features, featured } = plan
  const headingId = `plan-${id}-name`

  return (
    <article
      aria-labelledby={headingId}
      className={`flex flex-col overflow-hidden rounded-2xl bg-white ${
        featured ? 'border-2 border-brand-blue shadow-card' : 'border border-line p-[25px]'
      }`}
    >
      {featured && (
        <p className="flex h-[30px] items-center justify-center bg-brand text-xs leading-[18px] font-bold tracking-[0.3px] text-white">
          Most Popular
        </p>
      )}
      <div className={`flex flex-1 flex-col ${featured ? 'px-6 pt-2 pb-6' : ''}`}>
        <h3 id={headingId} className="text-base leading-6 font-bold text-ink">
          {name}
        </h3>
        <p className="mt-1 flex items-baseline gap-1">
          <span className="text-[34px] leading-[34px] font-bold text-ink">${price}</span>
          <span className="text-xs leading-[18px] font-medium text-muted">/month</span>
        </p>
        <p className="mt-1 text-xs leading-[18px] text-muted">{tagline}</p>

        <ul className="mt-4 mb-6 flex flex-col gap-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs leading-[18px] text-muted">
              <img src={checkIcon} alt="" className="size-2.5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* All three buttons read "Get Started", so each gets the plan name for screen reader users. */}
        <Button
          href="#contact"
          size="sm"
          variant={featured ? 'primary' : 'outline'}
          aria-label={`Get Started with ${name}`}
          className="mt-auto w-full"
        >
          Get Started
        </Button>
      </div>
    </article>
  )
}
