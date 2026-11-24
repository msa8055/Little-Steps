'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Tone = 'primary' | 'sky' | 'mint' | 'sun' | 'rose' | 'muted'

export const toneSoft: Record<Tone, string> = {
  primary: 'bg-secondary text-secondary-foreground',
  sky: 'bg-sky-soft text-sky',
  mint: 'bg-mint-soft text-accent-foreground',
  sun: 'bg-sun-soft text-foreground',
  rose: 'bg-destructive/10 text-destructive',
  muted: 'bg-muted text-muted-foreground',
}
export const toneSolid: Record<Tone, string> = {
  primary: 'bg-primary text-primary-foreground',
  sky: 'bg-sky text-primary-foreground',
  mint: 'bg-mint text-foreground',
  sun: 'bg-sun text-foreground',
  rose: 'bg-destructive text-primary-foreground',
  muted: 'bg-muted text-foreground',
}

type BtnVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint' | 'sun' | 'danger' | 'sky'
const btnVariants: Record<BtnVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-[0_3px_0_0_oklch(0.4_0.2_292)] hover:brightness-110 active:translate-y-0.5 active:shadow-none',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-lavender',
  outline: 'border-2 border-border bg-card text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
  mint: 'bg-mint text-foreground shadow-[0_3px_0_0_oklch(0.55_0.12_165)] hover:brightness-105 active:translate-y-0.5 active:shadow-none',
  sun: 'bg-sun text-foreground shadow-[0_3px_0_0_oklch(0.7_0.15_80)] hover:brightness-105 active:translate-y-0.5 active:shadow-none',
  sky: 'bg-sky text-primary-foreground shadow-[0_3px_0_0_oklch(0.5_0.15_245)] hover:brightness-110 active:translate-y-0.5 active:shadow-none',
  danger: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
}
const btnSizes = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-2xl',
  icon: 'size-9 rounded-xl',
}

type BtnProps = {
  variant?: BtnVariant
  size?: keyof typeof btnSizes
  href?: string
  className?: string
  children?: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Btn({ variant = 'primary', size = 'md', href, className, children, ...props }: BtnProps) {
  const cls = cn(
    'inline-flex shrink-0 items-center justify-center font-bold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    btnVariants[variant],
    btnSizes[size],
    className,
  )
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ title, icon: Icon, action, sub, tone = 'primary' }: { title: string; icon?: LucideIcon; action?: ReactNode; sub?: string; tone?: Tone }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className={cn('flex size-9 items-center justify-center rounded-xl', toneSoft[tone])}>
            <Icon className="size-5" aria-hidden />
          </span>
        )}
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function Badge({ tone = 'primary', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold', toneSoft[tone], className)}>{children}</span>
}

const fieldCls = 'w-full rounded-xl border-2 border-input bg-card px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-ring/20 placeholder:text-muted-foreground'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldCls, 'h-10', className)} {...props} />
}
export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldCls, 'min-h-24 leading-relaxed', className)} {...props} />
}
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldCls, 'h-10 cursor-pointer', className)} {...props}>
      {children}
    </select>
  )
}

export function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children(id)}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Progress({ value, tone = 'primary', className, label }: { value: number; tone?: Tone; className?: string; label?: string }) {
  return (
    <div
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progress'}
    >
      <motion.div className={cn('h-full rounded-full', toneSolid[tone].split(' ')[0])} initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, value))}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
    </div>
  )
}

export function Ring({ value, size = 120, stroke = 12, children, color = 'var(--primary)' }: { value: number; size?: number; stroke?: number; children?: ReactNode; color?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth={stroke} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * Math.min(100, value)) / 100 }} transition={{ duration: 1, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export type TabDef = { id: string; label: string; icon?: LucideIcon }
export function Tabs({ tabs, value, onChange, className }: { tabs: TabDef[]; value: string; onChange: (id: string) => void; className?: string }) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto rounded-2xl bg-muted p-1', className)}>
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn('relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors', active ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
          >
            {active && <motion.span layoutId={`tab-${tabs.map((x) => x.id).join('')}`} className="absolute inset-0 rounded-xl bg-card shadow-sm" transition={{ type: 'spring', duration: 0.4 }} />}
            {t.icon && <t.icon className="relative size-4" aria-hidden />}
            <span className="relative">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function TabPanels({ tabs, panels, initial, className }: { tabs: TabDef[]; panels: Record<string, ReactNode>; initial?: string; className?: string }) {
  const [tab, setTab] = useState(initial ?? tabs[0].id)
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
          {panels[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  const w = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size]
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn('flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl', w)}
            initial={{ y: 40, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Close dialog">
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Confirm({ open, onClose, onConfirm, title, body, confirmLabel = 'Confirm', danger }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; body: string; confirmLabel?: string; danger?: boolean }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Btn>
        </>
      }
    >
      <p className="leading-relaxed text-muted-foreground">{body}</p>
    </Modal>
  )
}

export function PageHeader({ title, subtitle, icon: Icon, actions, tone = 'primary', eyebrow }: { title: string; subtitle?: string; icon?: LucideIcon; actions?: ReactNode; tone?: Tone; eyebrow?: string }) {
  return (
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start gap-4">
        {Icon && (
          <span className={cn('flex size-14 shrink-0 items-center justify-center rounded-2xl', toneSolid[tone])}>
            <Icon className="size-7" aria-hidden />
          </span>
        )}
        <div>
          {eyebrow && <p className="text-xs font-extrabold uppercase tracking-widest text-primary">{eyebrow}</p>}
          <h1 className="text-balance text-3xl font-semibold md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </motion.header>
  )
}

export function Stat({ label, value, icon: Icon, tone = 'primary', href, hint }: { label: string; value: ReactNode; icon: LucideIcon; tone?: Tone; href?: string; hint?: string }) {
  const inner = (
    <Card className={cn('flex items-center gap-4 p-4 transition', href && 'hover:-translate-y-0.5 hover:shadow-md')}>
      <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl', toneSoft[tone])}>
        <Icon className="size-6" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-semibold leading-tight">{value}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  )
  return href ? (
    <Link href={href} className="block rounded-3xl focus-visible:ring-3 focus-visible:ring-ring/50 outline-none">
      {inner}
    </Link>
  ) : (
    inner
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn('relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-input')}>
      <motion.span layout className={cn('absolute top-0.5 size-5 rounded-full bg-card shadow', checked ? 'right-0.5' : 'left-0.5')} />
    </button>
  )
}

const avatarTones = ['bg-primary', 'bg-sky', 'bg-mint', 'bg-sun', 'bg-chart-5']
export function Avatar({ name, src, size = 40, className }: { name: string; src?: string; size?: number; className?: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const tone = avatarTones[name.length % avatarTones.length]
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-heading font-semibold text-primary-foreground ring-2 ring-card', tone, className)} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {src ? <img src={src || '/placeholder.svg'} alt={name} className="size-full object-cover" /> : initials}
    </span>
  )
}

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null
  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Btn variant="ghost" size="icon" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft />
      </Btn>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Btn key={p} size="icon" variant={p === page ? 'primary' : 'ghost'} onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}>
          {p}
        </Btn>
      ))}
      <Btn variant="ghost" size="icon" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight />
      </Btn>
    </nav>
  )
}

export function Empty({ icon: Icon, title, body, action }: { icon: LucideIcon; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-border p-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon className="size-7" aria-hidden />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {action}
    </div>
  )
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cn('shrink-0 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition', active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/50')}>
      {children}
    </button>
  )
}

export function usePaged<T>(items: T[], per = 6) {
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(items.length / per))
  const safe = Math.min(page, pages)
  return { page: safe, pages, setPage, slice: items.slice((safe - 1) * per, safe * per) }
}

export function Grid({ children, cols = 3, className }: { children: ReactNode; cols?: 2 | 3 | 4; className?: string }) {
  const c = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 xl:grid-cols-3', 4: 'sm:grid-cols-2 xl:grid-cols-4' }[cols]
  return <div className={cn('grid grid-cols-1 gap-4', c, className)}>{children}</div>
}
