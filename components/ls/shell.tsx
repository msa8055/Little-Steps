'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Coins, Flame, LogOut, Menu, Moon, Search, Sun, X, Zap, ChevronDown, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { logout } from '@/lib/auth-actions'
import { navByRole, roleMeta } from '@/lib/nav'
import { useStore, type Role } from '@/lib/store'
import { careers, resources, scenarios, skills, safetyTopics, challenges } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { LittleBot } from './littlebot'
import { Avatar, Modal } from './ui'

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="no-print sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent role={role} />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[60] bg-foreground/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}>
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 26 }} className="h-full w-72 bg-sidebar" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 rounded-lg bg-card p-2" aria-label="Close menu">
                <X className="size-5" />
              </button>
              <SidebarContent role={role} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} onMenu={() => setMobileOpen(true)} onSearch={() => setSearchOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} role={role} />
      {role === 'child' && <LittleBot />}
    </div>
  )
}

function SidebarContent({ role }: { role: Role }) {
  const pathname = usePathname()
  const groups = navByRole[role]
  const home = roleMeta[role].home
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo href={home} />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label={`${roleMeta[role].label} navigation`}>
        {groups.map((g) => (
          <div key={g.title} className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">{g.title}</p>
            <ul className="flex flex-col gap-0.5">
              {g.items.map((item) => {
                const active = item.href === home ? pathname === home : pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={active ? 'page' : undefined} className={cn('relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-colors', active ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/80 hover:bg-muted')}>
                      {active && <motion.span layoutId={`nav-${role}`} className="absolute inset-0 rounded-xl bg-sidebar-accent" transition={{ type: 'spring', duration: 0.4 }} />}
                      <item.icon className={cn('relative size-[18px]', active && 'text-primary')} aria-hidden />
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

function Topbar({ role, onMenu, onSearch }: { role: Role; onMenu: () => void; onSearch: () => void }) {
  const { state, set, level } = useStore()
  const [menu, setMenu] = useState(false)
  const unread = state.notifications.filter((n) => !n.read).length
  const person = state.user.name || roleMeta[role].label
  return (
    <header className="no-print sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
      <button type="button" onClick={onMenu} className="rounded-xl p-2 hover:bg-muted lg:hidden" aria-label="Open menu">
        <Menu className="size-5" />
      </button>
      <button type="button" onClick={onSearch} className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-xl border-2 border-input bg-card px-3 text-sm text-muted-foreground hover:border-primary/50">
        <Search className="size-4" aria-hidden />
        <span className="flex-1 truncate text-left">Search lessons, careers, resources…</span>
        <kbd className="hidden rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold sm:inline">Ctrl K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-2">
        {role === 'child' && (
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/child/rewards" className="flex items-center gap-1.5 rounded-xl bg-sun-soft px-3 py-1.5 text-sm font-extrabold" aria-label={`${state.streak} day streak`}>
              <Flame className="size-4 text-destructive" aria-hidden /> {state.streak}
            </Link>
            <Link href="/child/rewards" className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-sm font-extrabold text-secondary-foreground" aria-label={`${state.xp} XP, level ${level}`}>
              <Zap className="size-4" aria-hidden /> {state.xp.toLocaleString()}
            </Link>
            <Link href="/child/rewards" className="flex items-center gap-1.5 rounded-xl bg-mint-soft px-3 py-1.5 text-sm font-extrabold text-accent-foreground" aria-label={`${state.coins} coins`}>
              <Coins className="size-4" aria-hidden /> {state.coins}
            </Link>
          </div>
        )}
        <button type="button" onClick={() => set((s) => ({ settings: { ...s.settings, dark: !s.settings.dark } }))} className="rounded-xl p-2 hover:bg-muted" aria-label="Toggle dark mode">
          {state.settings.dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        <Link href={`/${role}/notifications`} className="relative rounded-xl p-2 hover:bg-muted" aria-label={`Notifications, ${unread} unread`}>
          <Bell className="size-5" />
          {unread > 0 && <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-extrabold text-primary-foreground">{unread}</span>}
        </Link>
        <div className="relative">
          <button type="button" onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-muted" aria-expanded={menu} aria-haspopup="menu">
            <Avatar name={person} src={role === 'child' ? state.user.photo : undefined} size={34} />
            <span className="hidden text-sm font-bold md:inline">{person.split(' ')[0]}</span>
            <ChevronDown className="size-4" aria-hidden />
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div role="menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-popover p-2 shadow-xl" onMouseLeave={() => setMenu(false)}>
                <div className="px-3 py-2">
                  <p className="font-bold">{person}</p>
                  <p className="text-xs text-muted-foreground">{roleMeta[role].label} account</p>
                </div>
                {role === 'child' && (
                  <MenuLink href="/child/profile" icon={UserRound} onClick={() => setMenu(false)}>
                    View profile
                  </MenuLink>
                )}
                <MenuLink href={`/${role}/settings`} icon={UserRound} onClick={() => setMenu(false)}>
                  Settings
                </MenuLink>
                <form action={logout}>
                  <button type="submit" role="menuitem" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-destructive hover:bg-destructive/10">
                    <LogOut className="size-4" /> Sign out
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

function MenuLink({ href, icon: Icon, children, onClick }: { href: string; icon: typeof Bell; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} role="menuitem" onClick={onClick} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-muted">
      <Icon className="size-4" /> {children}
    </Link>
  )
}

function GlobalSearch({ open, onClose, role }: { open: boolean; onClose: () => void; role: Role }) {
  const [q, setQ] = useState('')
  const router = useRouter()
  const index = useMemo(() => {
    const nav = Object.entries(navByRole).flatMap(([r, groups]) => groups.flatMap((g) => g.items.map((i) => ({ title: i.label, kind: `${roleMeta[r as Role].label} page`, href: i.href }))))
    return [
      ...nav,
      ...skills.map((s) => ({ title: s.name, kind: 'Life skill', href: `/child/academy/${s.slug}` })),
      ...skills.flatMap((s) => s.lessons.map((l) => ({ title: l.title, kind: `Lesson · ${s.name}`, href: `/child/academy/${s.slug}` }))),
      ...safetyTopics.map((t) => ({ title: t.name, kind: 'Digital safety', href: `/child/safety/${t.slug}` })),
      ...careers.map((c) => ({ title: c.name, kind: 'Career', href: `/child/careers?c=${c.id}` })),
      ...resources.map((r) => ({ title: r.title, kind: `${r.type} · Library`, href: '/child/library' })),
      ...scenarios.map((s) => ({ title: s.title, kind: `Scenario · ${s.category}`, href: `/child/scenarios/${s.id}` })),
      ...challenges.map((c) => ({ title: c.title, kind: 'Challenge', href: '/child/challenges' })),
    ]
  }, [])
  const results = q.trim() ? index.filter((i) => `${i.title} ${i.kind}`.toLowerCase().includes(q.toLowerCase())).slice(0, 12) : index.filter((i) => i.href.startsWith(`/${role}`)).slice(0, 8)
  return (
    <Modal open={open} onClose={onClose} title="Global search">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-xl border-2 border-primary px-3">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to search everything…" aria-label="Search" className="h-11 flex-1 bg-transparent outline-none" />
        </div>
        <p className="text-xs font-bold text-muted-foreground">{q ? `${results.length} results` : 'Quick links'}</p>
        <ul className="flex flex-col gap-1">
          {results.map((r, i) => (
            <li key={`${r.href}-${r.title}-${i}`}>
              <button
                type="button"
                onClick={() => {
                  router.push(r.href)
                  onClose()
                  setQ('')
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-secondary"
              >
                <span className="font-bold">{r.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{r.kind}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No matches. Try “budget” or “speech”.</li>}
        </ul>
      </div>
    </Modal>
  )
}
