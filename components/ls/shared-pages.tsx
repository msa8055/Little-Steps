'use client'

import Link from 'next/link'
import { Bell, CheckCheck, Download, Lock, Palette, RotateCcw, Settings as SettingsIcon, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge, Btn, Card, CardTitle, Chip, Confirm, Empty, Field, Input, PageHeader, Select, Switch, TabPanels, Textarea } from './ui'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function NotificationsPage() {
  const { state, set } = useStore()
  const [filter, setFilter] = useState('All')
  const types = ['All', 'Unread', ...Array.from(new Set(state.notifications.map((n) => n.type)))]
  const list = state.notifications.filter((n) => filter === 'All' || (filter === 'Unread' ? !n.read : n.type === filter))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        subtitle={`${state.notifications.filter((n) => !n.read).length} unread`}
        icon={Bell}
        actions={
          <>
            <Btn variant="outline" onClick={() => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }))}><CheckCheck /> Mark all read</Btn>
            <Btn variant="ghost" onClick={() => set(() => ({ notifications: [] }))}><Trash2 /> Clear</Btn>
          </>
        }
      />
      <div className="flex flex-wrap gap-2">{types.map((t) => <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>{t}</Chip>)}</div>
      {list.length === 0 ? (
        <Empty icon={Bell} title="You're all caught up" body="New updates about tasks, rewards and sessions will appear here." />
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((n) => (
            <li key={n.id}>
              <Card className={cn('flex items-start gap-3 p-4', !n.read && 'border-primary/40 bg-secondary/40')}>
                <span className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', n.read ? 'bg-muted' : 'bg-primary')} aria-label={n.read ? 'Read' : 'Unread'} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{n.title}</p>
                    <Badge tone="muted">{n.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
                </div>
                <div className="flex gap-1">
                  {n.href && <Btn href={n.href} size="sm" variant="ghost">Open</Btn>}
                  <Btn size="sm" variant="ghost" onClick={() => set((s) => ({ notifications: s.notifications.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)) }))}>{n.read ? 'Unread' : 'Read'}</Btn>
                  <button type="button" aria-label="Delete notification" className="rounded-lg p-2 text-muted-foreground hover:text-destructive" onClick={() => set((s) => ({ notifications: s.notifications.filter((x) => x.id !== n.id) }))}><Trash2 className="size-4" /></button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const faces = ['smile', 'cool', 'star', 'rocket']
const avatarColors = ['bg-primary', 'bg-mint', 'bg-sky', 'bg-sun', 'bg-destructive']

export function SettingsPage() {
  const { hydrated } = useStore()
  return hydrated ? <SettingsContent /> : null
}

function SettingsContent() {
  const { state, set, reset } = useStore()
  const [profile, setProfile] = useState({ name: state.user.name, email: state.user.email, bio: state.user.bio })
  const [confirm, setConfirm] = useState(false)
  const s = state.settings
  const setS = (patch: Partial<typeof s>) => set((st) => ({ settings: { ...st.settings, ...patch } }))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Profile, privacy, accessibility and more." icon={SettingsIcon} />
      <TabPanels
        tabs={[{ id: 'profile', label: 'Profile', icon: UserRound }, { id: 'appearance', label: 'Appearance', icon: Palette }, { id: 'notifs', label: 'Notifications', icon: Bell }, { id: 'security', label: 'Privacy & security', icon: Lock }]}
        panels={{
          profile: (
            <Card className="flex max-w-2xl flex-col gap-4">
              <CardTitle title="Your profile" />
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn('flex size-16 items-center justify-center rounded-full font-heading text-2xl font-semibold text-primary-foreground', state.user.avatarColor)}>{state.user.name[0]}</span>
                <div className="flex gap-1.5">
                  {avatarColors.map((c) => (
                    <button key={c} type="button" aria-label={`Avatar colour ${c}`} onClick={() => set((st) => ({ user: { ...st.user, avatarColor: c } }))} className={cn('size-8 rounded-full ring-offset-2 ring-offset-card', c, state.user.avatarColor === c && 'ring-2 ring-foreground')} />
                  ))}
                </div>
              </div>
              <Field label="Display name">{(id) => <Input id={id} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />}</Field>
              <Field label="Sign-in email">{(id) => <Input id={id} type="email" value={state.user.email} readOnly />}</Field>
              <Field label="Bio">{(id) => <Textarea id={id} rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />}</Field>
              <Btn className="w-fit" onClick={() => { if (profile.name.trim().length < 2) return toast.error('Name is too short'); set((st) => ({ user: { ...st.user, ...profile } })); toast.success('Profile saved') }}>Save changes</Btn>
            </Card>
          ),
          appearance: (
            <Card className="flex max-w-2xl flex-col gap-5">
              <CardTitle title="Appearance & accessibility" />
              <Switch label="Dark mode" checked={s.dark} onChange={(v) => setS({ dark: v })} />
              <Switch label="High contrast" checked={s.contrast} onChange={(v) => setS({ contrast: v })} />
              <Switch label="Dyslexia-friendly font" checked={s.dyslexia} onChange={(v) => setS({ dyslexia: v })} />
              <Switch label="Reduce motion" checked={s.reduceMotion} onChange={(v) => setS({ reduceMotion: v })} />
              <div className="flex flex-col gap-2">
                <label htmlFor="fs" className="text-sm font-bold">Text size: {s.fontSize}px</label>
                <input id="fs" type="range" min={14} max={22} value={s.fontSize} onChange={(e) => setS({ fontSize: Number(e.target.value) })} className="accent-primary" />
              </div>
              <Field label="Language">{(id) => <Select id={id} value={s.language} onChange={(e) => { setS({ language: e.target.value }); toast.success(`Language set to ${e.target.value}`) }}>{['English', 'हिन्दी', 'मराठी', 'தமிழ்', 'বাংলা'].map((l) => <option key={l}>{l}</option>)}</Select>}</Field>
            </Card>
          ),
          notifs: (
            <Card className="flex max-w-2xl flex-col gap-5">
              <CardTitle title="Notification preferences" />
              {Object.entries(s.notifications).map(([k, v]) => (
                <Switch key={k} label={k} checked={v} onChange={(nv) => setS({ notifications: { ...s.notifications, [k]: nv } })} />
              ))}
            </Card>
          ),
          security: (
            <div className="grid max-w-4xl gap-4 lg:grid-cols-2">
              <Card className="flex flex-col gap-5">
                <CardTitle title="Privacy" />
                <Switch label="Public profile" checked={s.profilePublic} onChange={(v) => setS({ profilePublic: v })} />
                <Switch label="Show achievements to friends" checked={s.showAchievements} onChange={(v) => setS({ showAchievements: v })} />
                <Switch label="Allow messages from mentors" checked={s.allowMessages} onChange={(v) => setS({ allowMessages: v })} />
              </Card>
              <Card><CardTitle title="Local workspace" sub="Profiles and progress are stored in this browser." /></Card>
              <Card className="flex flex-col gap-3 lg:col-span-2">
                <CardTitle title="Your data" />
                <div className="flex flex-wrap gap-2">
                  <Btn variant="outline" onClick={() => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'littlesteps-data.json'; a.click() }}><Download /> Download my data</Btn>
                  <Btn variant="danger" onClick={() => setConfirm(true)}><RotateCcw /> Clear local data</Btn>
                </div>
              </Card>
            </div>
          ),
        }}
      />
      <Confirm open={confirm} onClose={() => setConfirm(false)} onConfirm={() => { reset(); setProfile({ name: '', email: '', bio: '' }) }} title="Clear this local workspace?" body="This clears your progress, tasks, journal and settings in this browser." confirmLabel="Reset" danger />
      <p className="text-xs text-muted-foreground">Need help? <Link href="/contact" className="font-bold text-primary">Contact support</Link></p>
    </div>
  )
}
export { faces }
