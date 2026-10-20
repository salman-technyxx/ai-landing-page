import { Container } from '../ui/Container'
import { ContactForm } from './ContactForm'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-10 md:bg-soft md:py-20">
      <Container className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-12 xl:grid-cols-[429px_675px] xl:justify-between">
        <div className="lg:pt-4">
          <p className="mb-2 text-xs leading-[18px] font-bold tracking-[0.6px] text-brand-blue uppercase">Get in touch</p>
          <h2 id="contact-heading" className="text-2xl leading-[30px] font-extrabold text-ink md:text-[34px] md:leading-[37.4px]">
            Let&apos;s build the future together
          </h2>
          <p className="mt-3 max-w-[400px] text-xs leading-[18px] text-muted md:text-[13px] md:leading-[21.13px]">
            Have questions? Want a demo? Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="md:rounded-2xl md:border md:border-line md:bg-white md:p-8 md:shadow-soft">
          <ContactForm />
        </div>
      </Container>
    </section>
  )
}
