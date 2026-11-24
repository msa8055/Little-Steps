'use client'

import { CalendarDays, Search, Star, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Avatar, Badge, Btn, Card, Chip, Empty, Field, Input, Modal, PageHeader, Select, TabPanels, Textarea } from './ui'
import type { Mentor } from '@/lib/data'
import { inDays, uid, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function MentorsPage({ title = 'Find a Mentor' }: { title?: string }) {
  const { state, set, notify, addXP } = useStore()
  const [q, setQ] = useState('')
  const [skill, setSkill] = useState('All')
  const [book, setBook] = useState<Mentor | null>(null)
  const [f, setF] = useState({ date: inDays(1), time: '', topic: '' })
  const [rate, setRate] = useState<{ id: string; r: number; notes: string } | null>(null)
  const mentor = state.workspace.mentor
  const available = mentor && state.workspace.mentorStatus[mentor.id] === 'Approved' ? [mentor] : []
  const all = ['All', ...Array.from(new Set(available.flatMap((m) => m.expertise)))].slice(0, 10)
  const list = available.filter((m) => (skill === 'All' || m.expertise.includes(skill)) && (m.name + m.title).toLowerCase().includes(q.toLowerCase()))
  const confirm = () => {
    if (!book || !f.date || f.date < inDays(0) || !book.slots.includes(f.time) || !book.expertise.includes(f.topic)) return toast.error('Pick a valid date, time and topic')
    if (!available.some((mentor) => mentor.id === book.id)) return toast.error('This mentor is no longer available')
    if (state.bookings.some((booking) => booking.status === 'upcoming' && booking.mentorId === book.id && booking.date === f.date && booking.time === f.time)) {
      return toast.error('This time is already booked')
    }
    set((s) => ({ bookings: [{ id: uid(), mentorId: book.id, date: f.date, time: f.time, topic: f.topic, status: 'upcoming' }, ...s.bookings] }))
    notify({ title: 'Session booked', body: `${book.name} · ${f.date} at ${f.time}`, type: 'Mentor', href: '/child/mentors' })
    toast.success('Session booked!', { description: `${book.name} · ${f.date} ${f.time}` })
    setBook(null)
  }
  const sessions = (status: string) => state.bookings.filter((b) => b.status === status)
  const SessionList = ({ status }: { status: 'upcoming' | 'completed' | 'cancelled' }) =>
    sessions(status).length === 0 ? (
      <Empty icon={CalendarDays} title={`No ${status} sessions`} body="Book a mentor to get started." />
    ) : (
      <ul className="flex flex-col gap-2">
        {sessions(status).map((b) => {
          const name = mentor?.id === b.mentorId ? mentor.name : 'Mentor'
          return (
            <li key={b.id}>
              <Card className="flex flex-wrap items-center gap-3 p-4">
                <Avatar name={name} />
                <div className="flex-1">
                  <p className="font-bold">{b.topic}</p>
                  <p className="text-sm text-muted-foreground">{name} · {b.date} at {b.time}</p>
                  {b.rating && <p className="text-xs text-sun">{'★'.repeat(b.rating)}</p>}
                </div>
                {status === 'upcoming' && (
                  <>
                    <Btn size="sm" variant="outline" onClick={() => setRate({ id: b.id, r: 5, notes: '' })}>Mark done</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => set((s) => ({ bookings: s.bookings.map((x) => (x.id === b.id ? { ...x, status: 'cancelled' } : x)) }))}><X /> Cancel</Btn>
                  </>
                )}
              </Card>
            </li>
          )
        })}
      </ul>
    )
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Grow" title={title} subtitle="Browse approved profiles and request a session." icon={UserRound} tone="mint" />
      <TabPanels
        tabs={[{ id: 'find', label: 'Find mentors' }, { id: 'up', label: `Upcoming (${sessions('upcoming').length})` }, { id: 'done', label: 'Completed' }, { id: 'cx', label: 'Cancelled' }]}
        panels={{
          find: (
            <div className="flex flex-col gap-4">
              <div className="relative max-w-md">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input aria-label="Search mentors" placeholder="Search by name or title…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
              </div>
              <div className="flex flex-wrap gap-2">{all.map((s) => <Chip key={s} active={skill === s} onClick={() => setSkill(s)}>{s}</Chip>)}</div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {list.length === 0 && <p>{available.length ? "No mentors match your filters." : "No approved mentors are listed in this workspace."}</p>}
                {list.map((m) => (
                  <Card key={m.id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} size={52} />
                      <div><p className="font-bold">{m.name}</p><p className="text-sm text-muted-foreground">{m.title}</p></div>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                    <div className="flex flex-wrap gap-1.5">{m.expertise.map((e) => <Badge key={e} tone="sky">{e}</Badge>)}</div>
                    <Btn onClick={() => { setBook(m); setF({ date: inDays(1), time: '', topic: '' }) }}>Book session</Btn>
                  </Card>
                ))}
              </div>
            </div>
          ),
          up: <SessionList status="upcoming" />,
          done: <SessionList status="completed" />,
          cx: <SessionList status="cancelled" />,
        }}
      />
      <Modal open={!!book} onClose={() => setBook(null)} title={`Book ${book?.name ?? ''}`} footer={<Btn onClick={confirm}>Confirm booking</Btn>}>
        {book && (
          <div className="flex flex-col gap-4">
            <Field label="Date">{(id) => <Input id={id} type="date" min={inDays(0)} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />}</Field>
            <fieldset>
              <legend className="mb-2 text-sm font-bold">Available times</legend>
              <div className="flex flex-wrap gap-2">{book.slots.map((s) => <Chip key={s} active={f.time === s} onClick={() => setF({ ...f, time: s })}>{s}</Chip>)}</div>
            </fieldset>
            <Field label="What would you like to talk about?">{(id) => <Select id={id} value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}><option value="">Choose a topic</option>{book.expertise.map((e) => <option key={e}>{e}</option>)}</Select>}</Field>
          </div>
        )}
      </Modal>
      <Modal open={!!rate} onClose={() => setRate(null)} title="Rate your session" footer={<Btn onClick={() => { if (!rate) return; set((s) => ({ bookings: s.bookings.map((x) => (x.id === rate.id ? { ...x, status: 'completed', rating: rate.r, notes: rate.notes } : x)) })); addXP(50, 'Mentor session complete'); setRate(null) }}>Submit</Btn>}>
        {rate && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={rate.r === n} aria-label={`${n} stars`} onClick={() => setRate({ ...rate, r: n })}><Star className={cn('size-8', n <= rate.r ? 'fill-sun text-sun' : 'text-muted-foreground')} /></button>
              ))}
            </div>
            <Textarea aria-label="Session notes" rows={3} placeholder="What did you learn?" value={rate.notes} onChange={(e) => setRate({ ...rate, notes: e.target.value })} />
          </div>
        )}
      </Modal>
    </div>
  )
}

