import { features } from '../../data/features'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { FeatureCard } from './FeatureCard'

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="bg-white py-8 md:py-16">
      <Container>
        <SectionHeading
          id="features-heading"
          title="Everything your team needs to move faster"
          description="Powerful features to help you plan, automate and collaborate, all in one place."
          align="center-from-md"
          compactOnMobile
        />
        {/* 1 column below 768px, 2x2 from 768px, 4 across from 1024px. 768 and 1024 are not in Figma. */}
        <div className="mt-5 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  )
}
