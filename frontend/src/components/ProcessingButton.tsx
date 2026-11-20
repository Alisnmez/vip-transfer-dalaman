import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ProcessingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  processing: boolean
  processingLabel?: string
  children: ReactNode
}

/** Reusable visual feedback for async actions; use with useAsyncAction. */
export function ProcessingButton({
  processing,
  processingLabel = 'Processing...',
  children,
  disabled,
  type = 'button',
  ...props
}: ProcessingButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || processing} aria-busy={processing}>
      {processing ? (
        <span className="inline-flex items-center justify-center gap-2" role="status">
          <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          {processingLabel}
        </span>
      ) : children}
    </button>
  )
}
