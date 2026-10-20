import type { ReactNode } from 'react'
import { errorId } from './formStyles'

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  className?: string
  children: ReactNode
}

// Label + control + error message. The control is passed in so each field keeps its own typed
// register() call; it links itself to the error with aria-describedby={errorId(id)}.
export function FormField({ id, label, required = false, error, className = '', children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs leading-[18px] font-medium text-ink md:mb-1.5 md:text-[13px] md:leading-[19.5px] md:font-semibold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <p id={errorId(id)} className="mt-1 text-xs leading-[18px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
