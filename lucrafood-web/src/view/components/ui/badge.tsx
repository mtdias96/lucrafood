import * as React from 'react'
import { cn } from '@/app/utils/utils'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-primary/10 text-primary border-primary/20',
  secondary:
    'bg-secondary text-secondary-foreground border-secondary',
  success:
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-600 border-amber-500/20',
  destructive:
    'bg-destructive/10 text-destructive border-destructive/20',
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
