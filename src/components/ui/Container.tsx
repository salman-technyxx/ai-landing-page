import type { ComponentPropsWithoutRef } from 'react'

// Figma: content is max 1440px wide with 64px side padding on desktop and 20px on mobile.
export function Container({ className = '', ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-16 ${className}`} {...props} />
}
