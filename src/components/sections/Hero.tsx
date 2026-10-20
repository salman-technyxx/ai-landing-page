import checkIcon from '../../assets/icons/check.svg'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { DashboardMock } from './DashboardMock'

const trustNotes = ['No credit card required', 'Set up in minutes', 'Trusted by 10,000+ teams']

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-soft pt-8 pb-10 md:py-14 lg:flex lg:min-h-[600px] lg:items-center lg:py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2 xl:grid-cols-[491fr_629fr]">
        <div>
          <p className="mb-6 inline-flex h-[26px] items-center gap-2 rounded-full bg-tint px-2.5 text-[10px] font-medium text-muted md:mb-7 md:h-7 md:px-3.5 md:text-[11px]">
            <span className="font-bold text-brand-blue">New</span>
            AI-powered workflow for modern teams ›
          </p>

          <h1
            id="hero-heading"
            className="text-[36px] leading-9 font-extrabold md:max-w-[560px] tracking-[-0.9px] text-ink md:text-[48px] md:leading-[52px] md:tracking-[-1.2px] xl:text-[58px] xl:leading-[62.64px] xl:tracking-[-1.45px]"
          >
            <span className="block">Work smarter.</span>
            {/* Figma's mobile headline breaks after "handle"; desktop breaks after "the". */}
            Let AI handle <br className="md:hidden" />
            the repetitive work.
          </h1>

          <p className="mt-4 max-w-[500px] text-sm leading-5 text-muted md:mt-5 md:text-lg md:leading-[29.25px]">
            FlowPilot helps modern teams plan work, automate repetitive tasks, and keep everyone aligned.
          </p>

          <div className="mt-7 flex gap-3.5 md:mt-8 md:gap-4">
            <Button href="#contact" size="lg" className="flex-1 md:w-[150px] md:flex-none">
              Start Free
            </Button>
            <Button href="#how-it-works" variant="outline" size="lg" className="flex-1 md:w-[170px] md:flex-none">
              See How It Works
            </Button>
          </div>

          <ul className="mt-8 flex flex-col gap-2.5 text-xs text-muted md:mt-9 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-3 md:text-[13px]">
            {trustNotes.map((note) => (
              <li key={note} className="flex items-center gap-3 md:gap-2.5">
                <img src={checkIcon} alt="" className="size-2.5" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:justify-self-end lg:max-w-[700px] lg:w-full">
          <DashboardMock />
        </div>
      </Container>
    </section>
  )
}
