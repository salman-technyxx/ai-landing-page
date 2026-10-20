import logoMark from '../../assets/icons/logo-mark.svg'
import { footerCopyright, legalLinks } from '../../data/footer'
import { Container } from '../ui/Container'
import { ignorePlaceholder } from '../ui/placeholderLink'

// Figma: one row on desktop (logo left, copyright center, three links right), 1px top border, 49px above and
// 48px below. Mobile (375px): logo and copyright share the first row, the three links sit in a second row of
// three columns, 25px above and 24px below.
export function Footer() {
  return (
    <footer className="border-t border-divider bg-white pt-[25px] pb-6 md:pt-[49px] md:pb-12">
      <Container className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-[26px] md:grid-cols-[1fr_auto_1fr] md:gap-x-8">
        <a href="#top" className="inline-flex items-center gap-2 justify-self-start text-[13px] leading-[19.5px] font-bold text-ink">
          <img src={logoMark} alt="" className="h-[19.5px] w-[13px]" />
          FlowPilot
        </a>

        <p className="text-right text-[11px] leading-[16.5px] text-muted md:text-center md:text-[13px] md:leading-[19.5px]">
          {footerCopyright}
        </p>

        {/* Text size and line height are set on the list too, so its rows are 19.5px tall like the links (Figma),
            not the page default of 24px. */}
        <nav aria-label="Legal" className="col-span-2 text-[13px] leading-[19.5px] md:col-span-1 md:justify-self-end">
          <ul className="grid grid-cols-3 md:flex md:gap-6">
            {legalLinks.map((link) => (
              <li key={link.label} className="justify-self-center first:justify-self-start last:justify-self-end">
                <a
                  href={link.href}
                  onClick={ignorePlaceholder}
                  className="text-[13px] leading-[19.5px] text-muted transition hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
