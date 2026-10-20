const textClasses = 'text-[17px] font-bold tracking-[-0.425px] text-ink'

// Figma (node 1:987) draws the header logo as one text run, "▰ FlowPilot": Inter Bold 17px,
// #101828, -0.425px tracking, no gradient. Pass `href` to render it as a link.
export function Logo({ href }: { href?: string }) {
  if (href) {
    return (
      <a href={href} className={textClasses}>
        ▰ FlowPilot
      </a>
    )
  }
  return <span className={textClasses}>▰ FlowPilot</span>
}
