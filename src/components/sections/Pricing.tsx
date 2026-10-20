import { plans } from '../../data/plans'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { PricingCard } from './PricingCard'

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-10 md:py-20">
      <Container>
        <SectionHeading
          id="pricing-heading"
          title="Simple, transparent pricing"
          description="Choose the plan that works best for your team."
          align="center-from-md"
        />
        {/* Stacked below 768px (approved). Three columns from 768px; Figma only shows 1440px. */}
        <div className="mt-6 grid gap-5 md:mt-14 md:grid-cols-3 lg:gap-6 xl:gap-[42px]">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Container>
    </section>
  )
}
