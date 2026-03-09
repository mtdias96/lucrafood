import * as React from 'react'
import { cn } from '@/app/utils/utils'
import { X } from 'lucide-react'

/* ── Overlay ─────────────────────────────────────────────────── */

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

function Dialog({ open, onClose, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />
      {children}
    </div>
  )
}

/* ── Content ─────────────────────────────────────────────────── */

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement>

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative z-50 w-full max-w-lg mx-4 rounded-xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 fade-in-0 duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
DialogContent.displayName = 'DialogContent'

/* ── Header ──────────────────────────────────────────────────── */

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 mb-4', className)}
      {...props}
    />
  )
}

/* ── Title ───────────────────────────────────────────────────── */

function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  )
}

/* ── Description ─────────────────────────────────────────────── */

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

/* ── Close Button ────────────────────────────────────────────── */

function DialogCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground opacity-70 hover:opacity-100 hover:bg-accent transition-all cursor-pointer"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Fechar</span>
    </button>
  )
}

/* ── Footer ──────────────────────────────────────────────────── */

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6',
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
  DialogFooter,
}
