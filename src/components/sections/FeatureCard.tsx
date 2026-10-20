import type { Feature } from '../../data/features'

// Compact horizontal card below 768px (Figma 375px: 76px tall); full vertical card from 768px (Figma 1440px: 200px tall).
export function FeatureCard({ feature }: { feature: Feature }) {
  const { title, description, shortDescription, icon } = feature

  return (
    <article className="flex items-center gap-3.5 rounded-[14px] border border-line bg-white p-[15px] transition duration-200 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-soft motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:min-h-[200px] md:flex-col md:items-start md:gap-0 md:rounded-2xl md:p-6">
      {'src' in icon ? (
        <img src={icon.src} alt="" className="size-11 shrink-0 md:mb-5" />
      ) : (
        <span
          aria-hidden="true"
          style={{ backgroundColor: icon.background }}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[17px] font-bold text-white md:mb-5"
        >
          {icon.text}
        </span>
      )}
      <div>
        <h3 className="text-sm leading-[17.5px] font-bold text-ink md:text-base md:leading-6">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-[16.5px] text-muted md:mt-1.5 md:text-[13px] md:leading-[16.9px]">
          <span className="md:hidden">{shortDescription}</span>
          <span className="hidden md:inline">{description}</span>
        </p>
      </div>
    </article>
  )
}
