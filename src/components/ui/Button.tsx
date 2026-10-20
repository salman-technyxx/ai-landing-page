import type { ComponentPropsWithoutRef } from 'react'

type Variant = 'primary' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'header'

const base =
  'inline-flex items-center justify-center gap-2 rounded-button px-5 font-semibold transition focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60'

// md: header / menu / cards (42-44px). lg: hero CTAs (44px on mobile, 48px from 768px, as in Figma).
const sizes: Record<Size, string> = {
  sm: 'h-10 text-[13px]', // pricing card buttons
  header: 'h-[42px] text-[13px]', // desktop header "Get Started" (Figma: 150x42, 13px); width is set by the caller
  md: 'py-3 text-sm',
  lg: 'h-11 text-[13px] md:h-12 md:text-sm',
}

const variants: Record<Variant, string> = {
  // Transparent border keeps primary and outline buttons the same height.
  primary: 'border border-transparent bg-brand text-white shadow-sm hover:brightness-110',
  outline: 'border border-line bg-white text-ink hover:border-brand-blue hover:text-brand-blue',
}

type ButtonProps = { variant?: Variant; size?: Size } & ComponentPropsWithoutRef<'button'>
type LinkButtonProps = { variant?: Variant; size?: Size; href: string } & ComponentPropsWithoutRef<'a'>

// Renders a real <a> when `href` is given (navigation), otherwise a <button> (actions).
export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = 'primary', size = 'md', className = '', ...rest } = props
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if ('href' in rest) {
    return <a className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)} />
  }
  const { type = 'button', ...buttonProps } = rest as ComponentPropsWithoutRef<'button'>
  return <button type={type} className={classes} {...buttonProps} />
}
