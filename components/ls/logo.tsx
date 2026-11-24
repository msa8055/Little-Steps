import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn('flex items-center gap-2 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50', className)} aria-label="LittleSteps home">
      <span className="flex items-end gap-0.5" aria-hidden>
        <span className="h-3 w-2.5 rounded-sm bg-mint" />
        <span className="h-5 w-2.5 rounded-sm bg-sky" />
        <span className="h-7 w-2.5 rounded-sm bg-primary" />
        <span className="mb-5 size-2 rounded-full bg-sun" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight">
        Little<span className="text-primary">Steps</span>
      </span>
    </Link>
  )
}
