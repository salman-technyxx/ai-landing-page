import { testimonials } from '../../data/testimonials'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { TestimonialSlider } from './TestimonialSlider'

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="py-10 md:py-20">
      <Container className="xl:flex xl:items-center xl:justify-between xl:gap-8">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Testimonials"
          title="Loved by modern teams"
          description="See how FlowPilot helps teams work smarter and save time."
          align="left"
        />
        <TestimonialSlider testimonials={testimonials} />
      </Container>
    </section>
  )
}
