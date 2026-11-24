'use client'

import { Bell, CalendarDays, Check, ListChecks, Pencil, Plus, Repeat, Timer, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge, Btn, Card, CardTitle, Chip, Empty, Field, Input, Modal, PageHeader, Ring, Select, TabPanels } from '@/components/ls/ui'
import { inDays, today, uid, useStore, type Priority, type Task } from '@/lib/store'
import { cn } from '@/lib/utils'

const prTone = { high: 'rose', medium: 'sun', low: 'mint' } as const
const empty = { title: '', priority: 'medium' as Priority, due: today(), category: 'Study', reminder: false }

function TaskList() {
  const { state, set, addXP } = useStore()
  const [filter, setFilter] = useState('Open')
  const [edit, setEdit] = useState<Task | null>(null)
  const [form, setForm] = useState(empty)
  const [open, setOpen] = useState(false)
  const [err, setErr] = useState('')
  const list = state.tasks
    .filter((t) => (filter === 'Open' ? !t.done : filter === 'Done' ? t.done : filter === 'Today' ? t.due === today() : filter === 'From parent' ? !!t.assignedBy : true))
    .sort((a, b) => a.due.localeCompare(b.due))
  const start = (t?: Task) => {
    setEdit(t ?? null)
    setForm(t ? { title: t.title, priority: t.priority, due: t.due, category: t.category, reminder: !!t.reminder } : empty)
    setErr('')
    setOpen(true)
  }
  const save = () => {
    if (form.title.trim().length < 2) return setErr('Give your task a name.')
    set((s) => ({ tasks: edit ? s.tasks.map((t) => (t.id === edit.id ? { ...t, ...form } : t)) : [{ id: uid(), done: false, ...form }, ...s.tasks] }))
    setOpen(false)
  }
  const toggle = (t: Task) => {
    set((s) => ({ tasks: s.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) }))
    if (!t.done) addXP(t.priority === 'high' ? 30 : 20, `Task done: ${t.title}`)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">{['Open', 'Today', 'From parent', 'Done', 'All'].map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}</div>
        <Btn onClick={() => start()}><Plus /> New task</Btn>
      </div>
      {list.length === 0 ? (
        <Empty icon={ListChecks} title="Nothing here" body="Add a task or pick a different filter." />
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((t) => (
            <li key={t.id}>
              <Card className="flex items-center gap-3 p-4">
                <button type="button" aria-label={t.done ? 'Mark not done' : 'Mark done'} onClick={() => toggle(t)} className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border-2', t.done ? 'border-mint bg-mint text-primary-foreground' : 'border-border hover:border-primary')}>
                  {t.done && <Check className="size-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn('font-bold', t.done && 'text-muted-foreground line-through')}>{t.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge tone={prTone[t.priority]}>{t.priority}</Badge>
                    <span className="flex items-center gap-1"><CalendarDays className="size-3" aria-hidden />{t.due === today() ? 'Today' : t.due}</span>
                    <span>{t.category}</span>
                    {t.reminder && <Bell className="size-3" aria-label="Reminder on" />}
                    {t.assignedBy && <Badge tone="sky">From {t.assignedBy}</Badge>}
                  </div>
                </div>
                <button type="button" aria-label="Edit task" onClick={() => start(t)} className="rounded-lg p-2 text-muted-foreground hover:text-foreground"><Pencil className="size-4" /></button>
                <button type="button" aria-label="Delete task" onClick={() => set((s) => ({ tasks: s.tasks.filter((x) => x.id !== t.id) }))} className="rounded-lg p-2 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Edit task' : 'New task'} footer={<Btn onClick={save}>Save</Btn>}>
        <div className="flex flex-col gap-3">
          <Field label="Task" error={err}>{(id) => <Input id={id} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Finish maths homework" />}</Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority">{(id) => <Select id={id} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>{['low', 'medium', 'high'].map((p) => <option key={p}>{p}</option>)}</Select>}</Field>
            <Field label="Due">{(id) => <Input id={id} type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />}</Field>
          </div>
          <Field label="Category">{(id) => <Select id={id} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Study', 'Home', 'Health', 'Hobby', 'Life Skills'].map((c) => <option key={c}>{c}</option>)}</Select>}</Field>
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" className="size-4 accent-primary" checked={form.reminder} onChange={(e) => setForm({ ...form, reminder: e.target.checked })} /> Remind me</label>
        </div>
      </Modal>
    </div>
  )
}

function Calendar() {
  const { state } = useStore()
  const days = Array.from({ length: 14 }, (_, i) => inDays(i))
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((d) => {
        const ts = state.tasks.filter((t) => t.due === d)
        const date = new Date(d)
        return (
          <Card key={d} className={cn('flex min-h-32 flex-col gap-2 p-3', d === today() && 'border-primary')}>
            <p className="text-xs font-extrabold uppercase text-muted-foreground">{date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
            {ts.map((t) => <span key={t.id} className={cn('truncate rounded-lg px-2 py-1 text-xs font-bold', t.done ? 'bg-muted line-through' : 'bg-secondary')}>{t.title}</span>)}
          </Card>
        )
      })}
    </div>
  )
}

function Habits() {
  const { state, set, addXP } = useStore()
  const [name, setName] = useState('')
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex gap-2">
        <Input aria-label="New habit" placeholder="New habit, e.g. Read 20 minutes" value={name} onChange={(e) => setName(e.target.value)} />
        <Btn disabled={!name.trim()} onClick={() => { set((s) => ({ habits: [...s.habits, { id: uid(), name, days: Array(7).fill(false) }] })); setName('') }}><Plus /> Add</Btn>
      </Card>
      {state.habits.map((h) => (
        <Card key={h.id} className="flex flex-wrap items-center gap-4 p-4">
          <Repeat className="size-5 text-primary" aria-hidden />
          <p className="min-w-32 flex-1 font-bold">{h.name}</p>
          <div className="flex gap-1.5">
            {h.days.map((d, i) => (
              <button key={i} type="button" aria-label={`${h.name} day ${i + 1}`} aria-pressed={d} onClick={() => { set((s) => ({ habits: s.habits.map((x) => (x.id === h.id ? { ...x, days: x.days.map((v, j) => (j === i ? !v : v)) } : x)) })); if (!d) addXP(5, h.name, 1) }} className={cn('flex size-9 items-center justify-center rounded-xl text-xs font-extrabold', d ? 'bg-mint text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                {labels[i]}
              </button>
            ))}
          </div>
          <Badge tone="mint">{h.days.filter(Boolean).length}/7</Badge>
          <button type="button" aria-label="Delete habit" onClick={() => set((s) => ({ habits: s.habits.filter((x) => x.id !== h.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
        </Card>
      ))}
    </div>
  )
}

function Pomodoro() {
  const { addXP } = useStore()
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const total = mode === 'focus' ? 25 * 60 : 5 * 60
  const [left, setLeft] = useState(total)
  const [run, setRun] = useState(false)
  useEffect(() => {
    if (!run) return
    if (left <= 0) {
      setRun(false)
      if (mode === 'focus') addXP(25, 'Focus session complete')
      const m = mode === 'focus' ? 'break' : 'focus'
      setMode(m)
      setLeft(m === 'focus' ? 25 * 60 : 5 * 60)
      return
    }
    const t = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(t)
  }, [run, left, mode, addXP])
  return (
    <Card className="flex flex-col items-center gap-5 py-10">
      <CardTitle title="Pomodoro focus timer" icon={Timer} />
      <div className="flex gap-2">
        {(['focus', 'break'] as const).map((m) => <Chip key={m} active={mode === m} onClick={() => { setMode(m); setRun(false); setLeft(m === 'focus' ? 1500 : 300) }}>{m === 'focus' ? 'Focus 25' : 'Break 5'}</Chip>)}
      </div>
      <Ring value={((total - left) / total) * 100} size={220} stroke={16} color={mode === 'focus' ? 'var(--primary)' : 'var(--mint)'}>
        <span className="font-heading text-5xl font-semibold tabular-nums" aria-live="off">{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</span>
      </Ring>
      <div className="flex gap-2">
        <Btn onClick={() => setRun(!run)}>{run ? 'Pause' : 'Start'}</Btn>
        <Btn variant="outline" onClick={() => { setRun(false); setLeft(total) }}>Reset</Btn>
      </div>
    </Card>
  )
}

export default function Tasks() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Organise" title="Tasks & Planner" subtitle="Plan your day, build habits and focus." icon={ListChecks} />
      <TabPanels tabs={[{ id: 'tasks', label: 'Tasks' }, { id: 'cal', label: 'Calendar' }, { id: 'habits', label: 'Habits' }, { id: 'focus', label: 'Focus timer' }]} panels={{ tasks: <TaskList />, cal: <Calendar />, habits: <Habits />, focus: <Pomodoro /> }} />
    </div>
  )
}
