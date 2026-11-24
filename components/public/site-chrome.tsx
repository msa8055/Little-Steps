'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/ls/logo'
import { Btn } from '@/components/ls/ui'
import { cn } from '@/lib/utils'

const links = [
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/testimonials', label: 'Stories' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
        <Logo />
        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn('rounded-xl px-3 py-2 text-sm font-bold hover:bg-muted', pathname === l.href && 'bg-secondary text-secondary-foreground')}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Btn href="/login" variant="ghost">
            Sign in
          </Btn>
          <Btn href="/register">Start free</Btn>
        </div>
        <button type="button" className="ml-auto rounded-xl p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 lg:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 font-bold hover:bg-muted">
              {l.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Btn href="/login" variant="outline">
              Sign in
            </Btn>
            <Btn href="/register">Start free</Btn>
          </div>
        </nav>
      )}
    </header>
  )
}

const footerCols = [
  { title: 'Platform', links: [['Features', '/features'], ['How it works', '/how-it-works'], ['Sign in', '/login']] },
  { title: 'Company', links: [['About us', '/about'], ['Our mission', '/mission'], ['Our vision', '/vision'], ['Stories', '/testimonials']] },
  { title: 'Help', links: [['FAQ', '/faq'], ['Contact us', '/contact'], ['Privacy policy', '/privacy'], ['Terms & conditions', '/terms']] },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-5 md:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Every Big Journey Starts With a Little Step. Life skills for ages 10–18, built with families, mentors and educators.</p>
        </div>
        {footerCols.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 LittleSteps Learning.</p>
    </footer>
  )
}
