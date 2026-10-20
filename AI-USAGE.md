# AI Usage

> Skeleton only. Each section is to be filled in by the developer with real evidence as the work happens.

## Agents / Roles

For each agent: responsibility and initial prompt. Agent definitions live in `.claude/agents/`.

- Project Planner:
- Frontend Implementation Agent:
- Reviewer / QA Agent:

## Strong Prompt and Why It Worked

## Weak Prompt and Improved Version

## Claude Recommendation Rejected or Modified

What Claude recommended, and why it was rejected or modified.

## Debugging Example

- Problem (expected vs. actual behavior):
- Investigation (evidence inspected):
- Claude prompt:
- Fix:
- Verification:

## Where Claude Helped Most

## A Meaningful Decision I Made Myself

Decisions the developer gave after reviewing the Project Planner's plan (the planner had listed 15 open questions):

- Mobile pricing: stack the three cards vertically (Figma's mobile frame showed a confusing duplicated Pro card).
- Omit the Yearly toggle; pricing is monthly only.
- Use Inter and the one brand gradient everywhere, including the mobile menu (Figma's menu used a different font and gradient).
- Hamburger menu below 1024px to avoid a cramped header.
- Testimonial slider wraps around and uses dots; no invented real customer identities.
- Message field: live counter, enforced 300-character maximum; names and messages are trimmed before validation; validate on submit, then revalidate on change.

## Implementation Log

Factual notes recorded as work happens. Prompts the developer wrote themselves still need to be added to the sections above.

### Hero dashboard mock: scrollable navigation at 768px and below (developer request)
- Request: at 768px and below the "Overview / Tasks / Automation" items should scroll horizontally instead of being squeezed, the parent container should be a `column`, nothing should overflow the page, and the design above 768px should stay as it was. I read "Overview, Tasks and Automation panels" as the dashboard mock's sidebar navigation items (Overview, Tasks, Automations, Team, Analytics, Settings), since those are the only elements with those names.
- Baseline measured first: at 375px the 110px sidebar left the content only about 180px, and at 768px the full row layout showed.
- Design choice: the mock now has two layouts chosen by screen width (`max 768px` column, `min 769px` row) instead of one layout patched with overrides. The reason is that the row layout already used container-query classes (`@xl:`), and mixing them with viewport classes on the same property (e.g. width) makes the winner depend on stylesheet order. Keeping them in separate branches means the desktop classes are untouched. The cost is that the navigation labels exist twice in the DOM; this is harmless because the mock is exposed as a single `role="img"`, so the hidden branch is not read out. The shared content (greeting, stats, tasks) is one `MockContent` component used by both branches.
- Interpretation notes: the breakpoint is "768px and below" exactly (so 768 is column, 769 is row). At 600px and 768px all six items fit, so the strip has nothing to scroll there; it scrolls when the items do not fit (320 and 375px).
- Verified in the browser at 320, 375, 600, 768, 769, 1024 and 1440px: the visible container's `flex-direction` is `column` at 320, 375, 600 and 768; the strip scrolls at 320/375 (465px of items in a 231-286px strip) and can be scrolled to its end; the page has no horizontal overflow at any width; above 768px the card sizes are identical to before the change (700x432 at 1440, 690x432 at 769, 421x271 at 1024) and the 1440px render matches the earlier screenshot.
- Tooling note: my screenshot script had the old dev-server port hardcoded and failed with "Cannot read properties of undefined"; the first fix attempt put a template placeholder in single quotes. Both were script mistakes, not app bugs.

### Footer corrected to match Figma (developer request)
- The developer compared the footer with Figma and asked for exactly: logo left, copyright centered, only Privacy / Terms / Security on the right, one row on desktop. The Product and Company columns, description and social links built earlier (which came from my reading of the brief, not from Figma) were removed, along with their data. This reverses my earlier decision and means the footer no longer includes the brief's "short description, grouped links and social links"; the developer chose Figma over that line of the brief, and the README records it.
- Centering choice: Figma lays the three items out with equal gaps (space-between), which puts the copyright about 52px left of the page center at 1440px. The request says "center", so the row is a 3-column grid with a flexible first and last column, and the copyright is exactly centered (measured: copyright center equals page center at 768, 1024 and 1440px).
- A measurement caught a small error: the first version was 122px tall instead of Figma's ~117.5px, because each link's list item inherited the page's 24px line height. Setting the line height on the nav fixed it; the footer now measures 117.5px with 49px top and 48px bottom padding.
- Mobile (375px, as in Figma): logo and copyright share the first row, the three links sit in a second row of three columns (left, center, right). Figma's mobile copyright text is shorter ("© 2025 FlowPilot, Inc."); the desktop text is used at every width to keep the content the same, wrapping onto two lines at 320px.
- Verified in the browser at 320, 375, 768, 1024 and 1440px: no horizontal overflow, no overlapping items, 13px/11px text sizes and colors as in Figma. The tests now assert the footer has exactly the logo link plus three links and no headings, link columns or social links.

### Testimonial slide animation (developer request)
- Request: the testimonial card should slide left smoothly when it changes. Design choice made: going forward the new card enters from the right while the old one leaves to the left; going back is mirrored (a slide that always moves left would look wrong when pressing "previous"). Wrapping from the last slide to the first still slides left because that is a forward step.
- Implementation: during a change, a hidden copy of the old card (`aria-hidden`, `inert`) slides out while the new one slides in, then the copy is removed by a timer slightly longer than the 450ms animation. A track of all slides was rejected: wrapping around would rewind across every slide instead of sliding one step.
- Problems avoided on purpose: (1) the card element is now replaced on every change, so a live region on the card itself would not be announced reliably; the live region moved to a persistent wrapper. (2) Sliding cards would widen the page; the wrapper clips horizontal overflow, with 12px side padding so the card's shadow is not cut. (3) Clicking again mid-slide would make cards jump, so navigation is ignored until the slide ends. (4) Users with `prefers-reduced-motion` (and the test DOM, which has no `matchMedia`) get an instant swap and no outgoing copy.
- My first measurement script reported no cards because `[aria-live=polite]` matched the tabs section's live region first; it was a bug in the script, fixed by scoping to `#testimonials`.
- Verified on the real page by sampling card positions over time at 1440 and 375px: Next goes 0 to -557px (old) and +557px to 0 (new) with an ease-out curve, Previous mirrors it, wraparound slides left, a second click at 60ms is ignored, the outgoing copy is gone by ~650ms, there is no horizontal overflow, and reduced motion swaps instantly. Mutation check: removing the "ignore while moving" guard fails the new test; restored afterwards.

### Header revisions after the developer's review
- The developer compared the Header with Figma and asked for: Get Started at exactly 13px and Figma's width, the full navigation from 768px (hamburger below), and a slide-in/out menu animation. The earlier "hamburger below 1024px" decision above was replaced by this one.
- Measured before changing anything: the button was 119x46px at 14px; Figma's node (1:1002) is 150x42px at 13px/19.5, so the height changed too, not only the width. Added a `header` size to `Button` (42px, 13px) instead of overriding the shared `md` size, so Hero, Pricing and form buttons are unchanged.
- The five links, Log In and Get Started fit at 768px without overlap, but with the desktop link gap (36px) the gaps around the nav were only ~14px. The link gap is 16px from 768 to 1023px and returns to 36px from 1024px, which leaves ~22px (measured with a 15px scrollbar present).
- Animation: the menu used to be mounted only while open, so it could not slide out. It is now always mounted and, while closed, is `inert`, `aria-hidden`, `invisible` and translated off to the right. Two details worth knowing: Tailwind v4 animates the `translate` property, not `transform`, so the transition must name `translate`; and `visibility` has its own transition timing (immediate when opening, delayed 300ms when closing) so focus works the moment it opens and a closed menu never covers the page.
- Edge case found while thinking it through: if the menu is open and the window grows to 768px+, the menu is hidden by CSS but the body would stay scroll-locked. A `matchMedia` listener closes the menu in that case.
- Verified on the real page through the browser's remote-debugging protocol: positions sampled during opening and closing (smooth 100% to 0 over ~300ms; visibility only turns hidden after the exit), nothing intercepting clicks after closing, focus on Close when opened and back on the hamburger when closed, body scroll locked then released, instant open/close with `prefers-reduced-motion: reduce`, and the resize case. Header measured at 375, 767, 768, 1024 and 1440px.
- Test check: removing `inert` from the menu makes the new "closed menu is hidden" test fail; restored afterwards.

### Contact form and Footer (steps 9-10)
- Figma has no error, submitting, success or Preferred Demo Time designs, and its two frames disagree with the brief in places (asterisks on desktop labels only, "0/300" instead of the brief's "120 / 300", placeholder text differs). The brief wins for behavior: counter uses "N / 300", asterisks are shown at every size, team sizes are the brief's `1-10 / 11-50 / 51-200 / 200+`.
- Decisions: validate on submit then on change; name, company and message are validated after trimming (done inside the validators so the counter still counts what was typed); the conditional field uses `shouldUnregister`; double submit is blocked by disabling the button and by a guard in the handler; the success text replaces the form inside a `role="status"` region. The form takes an optional `onSubmitted` prop so tests can see what would have been sent (the page does not use it).
- Lint caught two real issues in the first version: `watch()` is flagged by the React hooks lint rule as unsafe to memoize (replaced with `useWatch`), and passing `handleSubmit(onValid)` to the form while `onValid` read a ref during render (moved the call into the event handler). Helper exports were also moved out of `FormField.tsx` because mixing components and helpers breaks fast refresh.
- Test gaps found by mutation checks (this is the verification I would have missed): (1) After the first 6 form tests passed, I removed `shouldUnregister: true`: tests still passed, because React Hook Form already skips validation for unmounted fields. The real defect is a stale value leaking, so the test now selects "Evening", switches Team Size away, and asserts `demoTime` is absent from the payload and the field is empty when 200+ is chosen again; with the mutation it fails. (2) I removed the in-flight guard: tests still passed, because duplicate submits finish a few milliseconds after the first and my assertion ran at that exact moment. The test now waits 250ms before counting submissions; with the mutation it fails. Both mutations were then reverted.
- Verified in the browser at 375, 768, 1024 and 1440px: default state, all-fields-empty error state (first invalid field focused), Team Size 200+ showing a required Preferred Demo Time error, and the success message. The submitting state ("Sending…") is covered by a test, not by a screenshot.
- Footer: Figma only has a logo, a copyright line and Privacy / Terms / Security in one row. The brief also asks for a description, grouped links and social links, which the developer approved me writing. The description reuses the hero copy; Product links point at real page sections; Terms/Privacy/Security and the social links are `#` placeholders that do not jump the page (shared `ignorePlaceholder` helper, also applied to the header and menu Log In links after I noticed they scrolled to the top). The layout is an extension of Figma's bar, not a copy: Figma's mobile footer is a different arrangement.
- Whole-page browser check: no console errors or warnings at 375/768/1024/1440px (only Vite debug lines and the React DevTools hint) and no horizontal overflow; heading order is h1, h2, h3.

### Pricing (step 8)
- Followed the developer's decisions: monthly prices only (no Yearly toggle) and the three cards stacked vertically on mobile. Figma's mobile frame instead shows two "Pro Featured Card" nodes, one faded, so it was not used as a layout reference.
- Figma gives each card a different list gap (8px, 6px, 6px) and padding; a single consistent spacing is used. Border 1px + 25px padding on regular cards and 2px border + 24px padding on the featured card keep the content aligned.
- All three CTAs read "Get Started", so each has `aria-label="Get Started with <plan>"` (contains the visible text). They link to `#contact`; that target is my assumption, Figma has no links.
- Three columns from 768px is my own choice (Figma shows only 1440px and a mobile frame); verified at 768 and 1024 that the content does not wrap awkwardly.
- Measured and viewed at 375, 768, 1024 and 1440px: no horizontal overflow. Compared by eye with Figma at 1440px only.

### Tabs accessibility check and Testimonials (steps 6-7)
- Reviewing my own tabs code (before measuring anything) found a real accessibility flaw: only the active tab's panel was rendered, so the two inactive tabs had `aria-controls` pointing at ids that did not exist. Fixed with one always-present `tabpanel` (`id="feature-tabpanel"`) whose `aria-labelledby` follows the selected tab. Verified in the browser's accessibility tree (CDP `Accessibility.getFullAXTree`): roles `tablist`/`tab`/`tabpanel` correct, the panel's accessible name changes Plan -> Collaborate, every tab's `controls` resolves, exactly one `aria-live` region exists and the panel is not inside it. Two unit tests added for the same.
- The earlier 22px mobile height change was measured: the tab buttons stay at the same position (1707px) before and after switching, so only content below the tabs moves. Judged not a usability problem; left unchanged.
- Testimonials: Figma has one card and two arrow buttons (both layers named "Next testimonial"), no dots, and no controls in the 375px frame. Added dots, distinct accessible names ("Previous testimonial" / "Next testimonial"), wraparound, and a controls row under the card below 1280px. The two extra testimonials are fictional placeholders without measurable claims. The slider takes its data as a prop so it is reusable and testable.
- Debugging example (real): after the testimonial screenshots, the decorative quote mark showed as `â€œ` and the stars as `â˜…`. Expected: “ and ★. Evidence: screenshots at 1440/1024/768/375 and a search of `src` for `â`/`Ã` found only two lines, both in `TestimonialSlider.tsx`. Cause: my own mutation test. I temporarily changed the file and restored it with Windows PowerShell 5.1 `Get-Content -Raw` + `Set-Content -Encoding utf8`; `Get-Content` read the UTF-8 file as ANSI, so every non-ASCII character was re-encoded as garbage (and a BOM was added; it was also added to `FeatureTabs.tsx`, which had no non-ASCII text). Fix: replaced the characters with escapes (`'“'`, `'★'.repeat(5)`) so an encoding round trip cannot damage them, stripped the BOMs, and added a test asserting both characters. Lesson: do not round-trip source files through Windows PowerShell text cmdlets without `-Encoding UTF8` on the read side too.
- Test integrity check: replaced the wraparound expression with `i + 1`; the "wrap around at both ends" test failed, and passed after restoring.

### Interactive tabs (step 5)
- Figma inconsistency, decision made: the Plan card shows "40%" but its progress bar is drawn filled to about two-thirds (280 of 420px). A bar that disagrees with its own number looks like a bug, so the fill width is driven by the same `percent` value as the text. This deviates from the Figma pixels; changing it back would need a separate `progress` field in `data/tabs.ts`.
- Figma's 375px frame clips the third pill to "Colla" (fixed 108px pills in a 290px column). On mobile the three pills share the row equally (`flex-1`), so "Collaborate" is fully visible. 768/1024 (stacked layout) have no Figma reference.
- Two-column layout only from 1280px (`xl`): at 1024px the left column would be about 300px, too narrow for the 348px tab row, so it stays stacked there.
- Automate and Collaborate titles, descriptions and percentages (65%, 85%) are placeholders I wrote in the style of the Plan tab (approved by the developer). They are illustrative demo figures, not claims.
- Accessibility: WAI-ARIA tabs pattern (`tablist`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`, roving `tabIndex`, arrow keys with wraparound, Home/End). Known compromise: the `tabpanel` wraps only the left card; the percentage card sits beside it in the layout, so it is a separate `aria-live="polite"` region instead of being inside the panel.
- Test integrity check: after the tab tests passed on the first run, I temporarily replaced the click handler with a no-op. The "clicking a tab changes the displayed content" test failed, as it should, and passed again after restoring the code. The keyboard tests did not fail because they use a separate code path (`selectIndex`), as expected.
- Known small issue: on mobile the section grows about 22px when switching to Collaborate, because its description wraps to more lines (measured 591px to 613px). Left as is.

### Logo strip and Features (step 4)
- Figma was inconsistent in two places, handled explicitly instead of guessing: (1) the 375px logo strip frame is *named* "2 rows of 3 columns" but draws one row of five names without "shopify" and without the heading; I used a 3-column grid with all six names on mobile. (2) The 375px feature cards use shorter descriptions and drop the section subtitle; the data file holds a `shortDescription` per feature and the heading hides its subtitle below 768px.
- Wrong estimate caught by measurement: I set `lg:gap-x-24` for the logo strip assuming it fit at 1024px. The strip came out 253px tall instead of 196px because "shopify" wrapped onto a second row (six words need about 896px, the container has 881px). Fixed with `lg:gap-x-16 xl:gap-x-24`; re-measured at 1024 and 1280 (196px, one row).
- Figma draws the automation icon as the "⚙" character in a fallback font (WenQuanYi), which renders differently per OS. Replaced with a small coded SVG gear on the Figma tile color. This is a deliberate deviation from the node data.
- The "hover treatment" for feature cards is not in Figma (it has no hover states); the lift + shadow is my own addition for the brief's requirement, disabled when the user prefers reduced motion.
- Shared `SectionHeading` now uses the Figma features-heading sizes (26/28 mobile, 34/51 desktop) for every section, which differs by 2-4px from Figma's pricing (36px) and tabs (30px) headings. Accepted for consistency; revisit only if a visual comparison shows it matters.

### Verification pass and Hero (step 3)
- Checked the logo against Figma node data: the header logo (node 1:987) is a single text run `▰ FlowPilot`, Inter Bold 17px, solid `#101828`, -0.425px tracking. The first version colored the glyph with the brand gradient and had no tracking, so it did not match the source. Fixed `Logo.tsx`; the mobile menu now reuses it instead of a duplicate.
- Opened the mobile menu through the Chrome DevTools protocol at exact viewports (375x812, 375x568, 768x1024): no horizontal overflow, every link and both buttons inside the viewport, close button focused on open. The measurements also showed Log In (46px) and Get Started (44px) differing in height, because only the outline variant had a border. Fixed with a transparent border on the primary variant.
- Hero: built from Figma nodes 1:582 (desktop) and 2:1080 (mobile). The dashboard mock uses a CSS container query (`@xl:`, 576px) so it switches to the compact mobile mock based on the card's width, not the screen width. Needed because at 1024px the hero is two columns and the card is narrow, while at 768px it is stacked and wide.
- Visual issue found at 768px: the headline left "work." alone on the last line. Fixed with a `max-w-[560px]` on the heading at `md:`. Re-checked in the browser.
- The check icon was downloaded from Figma (its URLs expire after 7 days) to `src/assets/icons/check.svg`, with the viewBox cropped to the glyph; the path is unchanged.

### Step 1-2: tokens, shared primitives, Header
- Claude (implementer role) chose a Google Fonts `<link>` for Inter instead of the `@fontsource` npm package, to avoid adding a dependency. Trade-off: the font needs network access.
- Claude noticed before running anything that `backdrop-blur` on the sticky header would break the full-screen mobile menu: `backdrop-filter` makes a `fixed` child size to the header, not the viewport. The blur was removed. Not yet confirmed visually with the menu open; the unit tests do not cover layout.
- Real test failure while writing the menu test: `getAllByRole('link', { name })[0]` matched the hidden desktop nav link, because jsdom does not apply Tailwind's responsive `hidden` classes. Fixed by scoping queries with `within(menu)`.
- Headless Edge screenshots at `--window-size=375` were misleading: the hamburger looked missing because headless Edge enforces a minimum window width. Re-checked inside a true 375px-wide iframe, where the hamburger is present.

## Verification Notes

What was run and inspected by hand (build, lint, tests, browser checks at 375px, 768px and 1440px).

- Header, after step 2: `npm run build`, `npm run lint` and `npm test` (3 tests) passed. Header screenshots (headless Edge) looked correct at 1440px (desktop nav and actions), 768px (hamburger only) and 375px (hamburger, checked in a 375px iframe). The open mobile menu was checked in step 3 (see above).
- Testimonials, after step 7: build, lint and `npm test` passed (18 tests at that point). Screenshots at 375, 768, 1024 (before the encoding fix), then 375, 768, 1280 and 1440 after it, no horizontal overflow; slide 2 viewed at 1440 and 375 before the fix. Compared by eye with Figma at 1440 and 375 only.
- Contact form, Footer and the placeholder-link fix, after step 10: `npm run build` exit 0, `npm run lint` exit 0, `npm test` 30 tests in 9 files passed. README rewritten to match the repo.
- Tabs, after step 5: build, lint and `npm test` (12 tests in 5 files) passed. Screenshots at 375, 768, 1024 and 1440px (Plan), plus the Collaborate state at 375 and 1440px; no horizontal overflow. Compared by eye with Figma's screenshots at 1440 and 375 only.
- Logo strip + Features, after step 4: build, lint and `npm test` (8 tests) passed. Screenshots and overflow measurements at 375, 768, 1024 and 1440px, no horizontal overflow. Visually compared with Figma's screenshots at 1440 and 375 only. The 1024px strip fix was verified by measured height, not by viewing a new screenshot. At 375px the section screenshot crop was offset by about 26px (heading clipped in the image), but measured heights matched, so I treated it as a capture artifact.
- Hero, after step 3: build, lint and `npm test` (5 tests) passed. Hero screenshots taken at 375, 768, 1024 and 1440px with no horizontal overflow; Inter 400-800 confirmed loaded. Compared by eye against Figma's own screenshots for 1440 and 375 only; 768 and 1024 have no Figma reference.
