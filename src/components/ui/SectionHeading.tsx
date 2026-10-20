type SectionHeadingProps = {
  title: string
  description?: string
  eyebrow?: string
  id?: string
  align?: 'center' | 'left' | 'center-from-md'
  // Hide the description below 768px (Figma's mobile feature heading has no subtitle).
  compactOnMobile?: boolean
}

const alignment = {
  center: 'mx-auto text-center',
  left: 'text-left',
  'center-from-md': 'text-left md:mx-auto md:text-center',
}

// Sizes follow the Figma features heading (26/28 mobile, 34/51 desktop) and are shared by all sections.
export function SectionHeading({ title, description, eyebrow, id, align = 'center', compactOnMobile = false }: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${alignment[align]}`}>
      {eyebrow && <p className="mb-2 text-[13px] leading-[19.5px] font-bold tracking-[0.325px] text-brand-blue uppercase">{eyebrow}</p>}
      <h2 id={id} className="text-[26px] leading-7 font-extrabold text-ink md:text-[34px] md:leading-[51px] md:tracking-[-0.85px]">
        {title}
      </h2>
      {description && (
        <p className={`mt-3 text-[15px] leading-[22.5px] text-muted ${compactOnMobile ? 'hidden md:block' : ''}`}>{description}</p>
      )}
    </div>
  )
}
