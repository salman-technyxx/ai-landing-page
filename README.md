# FlowPilot Landing Page

Responsive marketing landing page for FlowPilot, built from a supplied Figma design for a frontend assessment.
All sections from the brief are implemented: header with mobile menu, hero with a coded dashboard visual,
trusted-company strip, four feature cards, interactive tabs, testimonial slider, three pricing cards, a validated
contact form, and a footer. There is no backend; the contact form simulates a one-second submission.

## Technology

- [Vite](https://vite.dev) + [React](https://react.dev) 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 (CSS-first: design tokens live in `src/index.css`, no `tailwind.config.js`)
- [React Hook Form](https://react-hook-form.com) for the contact form
- [Vitest](https://vitest.dev) + React Testing Library (`user-event`, `jest-dom`, `jsdom`) for tests
- Inter, loaded from Google Fonts in `index.html`

## Setup

Requires Node.js 20.19+ or 22.13+ and npm. (Node 22.12 works, but ESLint 10 prints engine warnings.)

```bash
npm install
```

## Commands

| Task | Command |
| --- | --- |
| Run dev server | `npm run dev` |
| Production build (type-check + bundle) | `npm run build` |
| Preview production build | `npm run preview` |
| Lint | `npm run lint` |
| Run tests once | `npm test` |
| Run tests in watch mode | `npm run test:watch` |

## Component structure

```
src/
  App.tsx                      Header, the page sections in order, Footer
  components/
    layout/    Header, MobileMenu, Logo, Footer
    sections/  Hero (+ DashboardMock), LogoStrip, Features (+ FeatureCard), FeatureTabs,
               Testimonials (+ TestimonialSlider), Pricing (+ PricingCard), Contact (+ ContactForm)
    ui/        Button, Container, SectionHeading, FormField, formStyles, placeholderLink
  data/        Typed content: navLinks, features, tabs, testimonials, plans, companies, footer, contact
  assets/icons Icons exported from Figma, plus one coded SVG (automation gear)
  test/        Vitest setup and a toolchain smoke test
```

Section content (features, tabs, testimonials, plans, links) lives in typed data files and the components map over
it, so adding a tab, plan or testimonial does not mean copying markup. `TestimonialSlider` takes its data as a prop.

## Tests

`npm test` runs 37 tests in 9 files. The ones that cover the required behavior:

- **Contact form** (`ContactForm.test.tsx`): an empty form cannot submit and shows an error per field; each field's
  rule (minimum lengths, valid email, whitespace trimmed); Team Size `200+` shows a required Preferred Demo Time;
  switching away removes it, does not leak its old value, and no longer blocks submit; live `N / 300` counter and the
  300-character limit; submit disables the button, shows "Sending…", ignores repeat submits, and shows the exact
  success message.
- **Tabs** (`FeatureTabs.test.tsx`): clicking a tab changes the content, only one tab is selected, arrow/Home/End keys,
  and the ARIA tab/panel association.
- **Testimonial slider** (`TestimonialSlider.test.tsx`): previous/next with wraparound, active indicator, indicator clicks,
  and the slide animation (direction, outgoing copy removed afterwards, clicks ignored while moving, instant swap with
  reduced motion).
- **Header menu, hero, features, logo strip, pricing and footer** each have a few tests for structure and behavior.

## Key decisions

- **Figma is the visual source of truth, the brief is the source of truth for behavior.** Where Figma was
  inconsistent or incomplete, the choice is recorded in `AI-USAGE.md` (for example the mobile pricing frame, the
  mobile tab row clipping "Collaborate", and the "40%" stat drawn with a two-thirds bar).
- **Responsive plan.** Figma only has a 1440px page and a few 375px frames, so 768px and 1024px layouts are my own.
  The full navigation is shown from 768px and the hamburger menu below it (the menu slides in from the right, and
  respects `prefers-reduced-motion`); pricing is stacked below 768px and three columns from 768px; the tabs and
  contact sections use two columns from 1280px. The hero dashboard mock is a column at 768px and below, with its
  navigation (Overview, Tasks, Automations, ...) as a horizontally scrolling strip; above 768px it is Figma's
  sidebar-and-content row, whose text sizes follow the card's own width (a CSS container query) so it works in both
  a narrow two-column hero and a wide stacked one.
- **Accessibility.** Semantic landmarks and heading order, labelled form fields with errors tied to them through
  `aria-describedby`, the first invalid field is focused on submit, WAI-ARIA tabs with keyboard support, a mobile menu
  with Escape, focus trapping and focus return, visible focus outlines, decorative icons hidden from screen readers, and
  reduced-motion support for transitions.
- **Form logic.** Validate on submit, then re-validate on change. Name, company and message are validated after
  trimming. The Preferred Demo Time field is registered with `shouldUnregister`, so hiding it removes its value and
  its rule. Double submits are prevented both by disabling the button and by a guard in the handler.

## Known limitations

- **Visual checks are limited.** Layouts were checked in headless Microsoft Edge at 375, 768, 1024 and 1440px and
  compared by eye with Figma's screenshots at 1440px and 375px only. There is no cross-browser (Firefox, Safari) or
  real-device testing, and no pixel-level comparison with Figma.
- **Placeholder content.** Figma defines only the Plan tab and one testimonial. The Automate and Collaborate tab text
  (and their percentages) and the other two testimonials are placeholders. Company "logos" are plain text wordmarks
  as in Figma. Log In and the footer's Privacy, Terms and Security links point at `#` because those pages do not exist.
- **Footer follows Figma, not the brief's list.** The footer is exactly the Figma design (logo, copyright, Privacy /
  Terms / Security). The brief also mentions a short description, grouped links and social links; those were built
  first and then removed at the developer's request, so the footer does not include them.
- **Not designed in Figma.** Error, success and submitting states, hover states and the testimonial dots are my own
  additions, kept consistent with the design's colors.
- **Contact form** does not send data anywhere; it waits one second and shows the success message.
- **Fonts** need network access (Google Fonts); without it the page falls back to the system font.
- **Copyright** is hard-coded to 2025, as in the design.
- Shared section headings use one size scale, which is 2 to 4px off Figma's pricing and tabs headings.
