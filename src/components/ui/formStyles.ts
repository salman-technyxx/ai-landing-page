export const errorId = (id: string) => `${id}-error`

// Shared by <input>, <select> and <textarea>. Mobile uses Figma's tinted field, desktop a white one.
export const controlClass = (invalid: boolean) =>
  `w-full rounded-input border bg-surface px-[13px] text-[13px] text-ink placeholder:text-muted md:h-[46px] md:bg-white md:px-[15px] md:text-sm ${
    invalid ? 'border-danger' : 'border-line'
  }`
