import { companies } from '../../data/companies'
import { Container } from '../ui/Container'

const LABEL_ID = 'logo-strip-label'

export function LogoStrip() {
  return (
    <section aria-labelledby={LABEL_ID} className="bg-white py-9 md:pt-[55px] md:pb-14">
      <Container>
        {/* Figma shows this label on desktop only; it stays available to screen readers on mobile. */}
        <p id={LABEL_ID} className="sr-only text-center text-[13px] leading-[19.5px] font-semibold text-muted md:not-sr-only">
          Trusted by modern teams
        </p>
        {/* Mobile: two rows of three (the Figma frame's name). From 768px: one centered row. */}
        <ul className="grid grid-cols-3 gap-y-6 md:mt-8 md:flex md:flex-wrap md:justify-center md:gap-x-12 lg:gap-x-16 xl:gap-x-24">
          {companies.map((name) => (
            <li key={name} className="text-center text-[13px] leading-[19.5px] font-semibold text-logo md:text-[22px] md:leading-[33px]">
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
