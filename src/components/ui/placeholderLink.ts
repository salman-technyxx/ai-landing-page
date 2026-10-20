import type { MouseEvent } from 'react'

// Links whose href is just "#" are placeholders (the project has no login or legal pages).
// Without this, clicking one would jump the page to the top.
export const ignorePlaceholder = (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.currentTarget.getAttribute('href') === '#') event.preventDefault()
}
