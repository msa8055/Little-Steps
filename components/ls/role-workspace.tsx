'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { toast } from 'sonner'
import { resources, skills } from '@/lib/data'
import { navByRole, roleMeta } from '@/lib/nav'
import { today, uid, useStore, type Role } from '@/lib/store'
import { Badge, Btn, Card, Field, Grid, Input, PageHeader, Progress, Select, Textarea } from './ui'
import { NotificationsPage } from './shared-pages'

export function RoleWorkspace({ role, section }: { role: Exclude<Role, 'child'>; section: string }) {
  const { hydrated } = useStore()
  const links = navByRole[role].flatMap((group) => group.items)
  const href = section ? '/' + role + '/' + section : '/' + role
  const page = links.find((item) => item.href === href)
  if (section === 'notifications') return <NotificationsPage />
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={page?.label ?? roleMeta[role].label} icon={page?.icon} eyebrow={roleMeta[role].label} />
      {hydrated && (
        section === '' ? <Overview role={role} /> :
        role === 'parent' ? <ParentSection section={section} /> :
        role === 'mentor' ? <MentorSection section={section} /> :
        <AdminSection section={section} />
      )}
    </div>
  )
}

function Overview({ role }: { role: Exclude<Role, 'child'> }) {
  const { state } = useStore()
  const summaries = {
    parent: [
      { label: 'Lessons completed', value: state.completedLessons.length, href: '/parent/reports' },
      { label: 'Upcoming bookings', value: state.bookings.filter((booking) => booking.status === 'upcoming').length, href: '/parent/calendar' },
    ],
    mentor: [
      { label: 'Upcoming sessions', value: state.bookings.filter((booking) => booking.mentorId === state.workspace.mentor?.id && booking.status === 'upcoming').length, href: '/mentor/sessions' },
      { label: 'Saved resources', value: state.workspace.mentorResources.length, href: '/mentor/resources' },
    ],
    admin: [
      { label: 'Reported posts', value: state.posts.filter((post) => post.reported).length, href: '/admin/reports' },
      { label: 'Open support requests', value: state.workspace.support.filter((request) => !request.resolved).length, href: '/admin/support' },
    ],
  }
  return <Grid>{summaries[role].map((item) => <Card key={item.href}>
    <p className="text-3xl font-bold">{item.value}</p>
    <Btn href={item.href} variant="outline">{item.label}</Btn>
  </Card>)}</Grid>
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <Card className="flex flex-col gap-3"><h2 className="text-xl font-semibold">{title}</h2>{children}</Card>
}

function TextForm({ label, action, onSave, multiline = false }: {
  label: string; action: string; onSave: (value: string) => void; multiline?: boolean
}) {
  const [value, setValue] = useState('')
  const Control = multiline ? Textarea : Input
  return <form className="flex flex-col items-start gap-3" onSubmit={(event) => {
    event.preventDefault()
    if (!value.trim()) return
    onSave(value.trim())
    setValue('')
  }}>
    <div className="w-full"><Field label={label}>{(id) => <Control id={id} required maxLength={1000} value={value} onChange={(event) => setValue(event.target.value)} />}</Field></div>
    <Btn type="submit">{action}</Btn>
  </form>
}

function ParentSection({ section }: { section: string }) {
  const { state, set, notify } = useStore()
  const [title, setTitle] = useState('')
  const [due, setDue] = useState(today)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const assigned = state.tasks.filter((task) => task.assignedBy)
  function assign(event: FormEvent) {
    event.preventDefault()
    if (!title.trim() || !due) return
    const task = { id: uid(), title: title.trim(), due, priority, done: false, category: 'Home', assignedBy: 'Parent' }
    set((current) => ({ tasks: [task, ...current.tasks] }))
    notify({ title: 'New family task', body: task.title, type: 'parent', href: '/child/tasks' })
    setTitle('')
    toast.success('Task assigned')
  }
  switch (section) {
    case 'children':
      return <Panel title="Local learner">{state.user.name ? <><p>{state.user.name}</p><Badge>{state.xp} XP</Badge><Btn href="/parent/reports" variant="outline">View learning report</Btn></> : <p>No learner profile has been filled in. Add a name in the learner’s settings.</p>}</Panel>
    case 'tasks':
      return <Grid cols={2}><Panel title={state.user.name ? 'Assign a task to ' + state.user.name : 'Assign a learner task'}>
        <form className="flex flex-col gap-3" onSubmit={assign}>
          <Field label="Task name">{(id) => <Input id={id} required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} />}</Field>
          <Field label="Due date">{(id) => <Input id={id} type="date" required min={today()} value={due} onChange={(event) => setDue(event.target.value)} />}</Field>
          <Field label="Priority">{(id) => <Select id={id} value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select>}</Field>
          <Btn type="submit">Assign task</Btn>
        </form>
      </Panel><Panel title="Assigned tasks">
        {assigned.length === 0 && <p>No assigned tasks yet.</p>}
        {assigned.map((task) => <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2" key={task.id}>
          <div><p className="font-bold">{task.title}</p><p className="text-sm">{task.due}</p></div>
          <Badge tone={task.done ? 'mint' : 'sun'}>{task.done ? 'Complete' : 'Open'}</Badge>
        </div>)}
      </Panel></Grid>
    case 'rewards':
      return <Panel title={(state.user.name || 'Learner') + ' · ' + state.coins + ' coins'}>
        <TextForm label="What are you celebrating?" action="Award 25 coins" onSave={(value) => {
          set((current) => ({ coins: current.coins + 25 }))
          notify({ title: 'Family reward · 25 coins', body: value, type: 'achievement', href: '/child/rewards' })
          toast.success('Reward awarded')
        }} />
      </Panel>
    case 'family':
      return <Panel title="Family challenge board">
        <TextForm label="Family goal" action="Add goal" onSave={(value) => set((current) => ({
          workspace: { ...current.workspace, familyGoals: [...current.workspace.familyGoals, { id: uid(), text: value, done: false }] },
        }))} />
        {state.workspace.familyGoals.map((goal) => <label key={goal.id} className="flex items-center gap-2">
          <input type="checkbox" checked={goal.done} onChange={(event) => {
            const done = event.target.checked
            set((current) => ({ workspace: { ...current.workspace, familyGoals: current.workspace.familyGoals.map((item) => item.id === goal.id ? { ...item, done } : item) } }))
          }} />{goal.text}
        </label>)}
      </Panel>
    case 'calendar': {
      const events = [
        ...assigned.filter((task) => !task.done).map((task) => ({ id: task.id, date: task.due, title: task.title })),
        ...state.bookings.filter((booking) => booking.status === 'upcoming').map((booking) => ({ id: booking.id, date: booking.date, title: booking.time + ' · ' + booking.topic })),
      ].sort((a, b) => a.date.localeCompare(b.date))
      return <Panel title="Scheduled tasks and sessions">
        {events.length ? events.map((event) => <p key={event.id}><time dateTime={event.date} className="mr-3 font-bold">{event.date}</time>{event.title}</p>) : <p>No scheduled events.</p>}
      </Panel>
    }
    case 'reports':
      return <Grid cols={2}><Panel title={(state.user.name || 'Learner') + '’s learning progress'}>
        <p>{state.completedLessons.length} lessons completed · {state.xp} XP</p>
        <Progress value={100 * state.completedLessons.length / skills.reduce((total, skill) => total + skill.lessons.length, 0)} label="Academy progress" />
        <p>{assigned.filter((task) => task.done).length} of {assigned.length} assigned tasks completed</p>
      </Panel><Panel title="Recent assessment results">
        {state.history.filter((item) => item.kind === 'Assessment').map((item) => <p key={item.id}>{item.title} · {item.score ?? '—'}%</p>)}
      </Panel></Grid>
    default:
      return null
  }
}

function MentorSection({ section }: { section: string }) {
  const { state, set, notify } = useStore()
  switch (section) {
    case 'mentees':
      return <Panel title="Learners with bookings">{state.bookings.length ? <p>{state.user.name || "Learner"}</p> : <p>No learners have booked a session.</p>}</Panel>
    case 'sessions': {
      const bookings = state.bookings.filter((booking) => booking.mentorId === state.workspace.mentor?.id)
      return <Panel title="Your bookings">
        {bookings.length === 0 && <p>No bookings yet.</p>}
        {bookings.map((booking) => <div key={booking.id} className="flex flex-wrap items-center gap-3 border-b border-border pb-3">
          <div className="flex-1"><p className="font-bold">{booking.topic}</p><p>{booking.date} · {booking.time}</p></div>
          <Badge>{booking.status}</Badge>
          {booking.status === 'upcoming' && <Btn variant="outline" onClick={() => {
            set((current) => ({ bookings: current.bookings.map((item) => item.id === booking.id && item.status === 'upcoming' ? { ...item, status: 'completed' } : item) }))
            notify({ title: 'Mentor session completed', body: booking.topic, type: 'session', href: '/child/mentors' })
          }}>Mark complete</Btn>}
        </div>)}
      </Panel>
    }
    case 'chat':
      return <Panel title={'Messages to ' + (state.user.name || 'learner')}>
        {state.workspace.mentorMessages.map((message) => <p key={message.id} className="rounded-xl bg-muted p-3">{message.text}</p>)}
        {!state.settings.allowMessages ? <p>Messaging is turned off in the learner’s settings.</p> : <TextForm label="Message" action="Send message" multiline onSave={(value) => {
          set((current) => ({ workspace: { ...current.workspace, mentorMessages: [...current.workspace.mentorMessages, { id: uid(), text: value }] } }))
          notify({ title: 'Message from ' + (state.workspace.mentor?.name || 'Mentor'), body: value, type: 'mentor' })
        }} />}
      </Panel>
    case 'resources':
      return <Panel title="Teaching resource notes">
        <TextForm label="Resource title or reference" action="Save resource" onSave={(value) => set((current) => ({
          workspace: { ...current.workspace, mentorResources: [...current.workspace.mentorResources, { id: uid(), text: value }] },
        }))} />
        {state.workspace.mentorResources.map((resource) => <div key={resource.id} className="flex items-center justify-between gap-2">
          <p className="break-all">{resource.text}</p><Btn variant="outline" onClick={() => set((current) => ({
            workspace: { ...current.workspace, mentorResources: current.workspace.mentorResources.filter((item) => item.id !== resource.id) },
          }))}>Remove</Btn>
        </div>)}
      </Panel>
    case 'profile':
      return <MentorProfile />
    default:
      return null
  }
}

function AdminSection({ section }: { section: string }) {
  const { state, set, notify } = useStore()
  const update: (description: string, change?: (workspace: typeof state.workspace) => Partial<typeof state.workspace>) => void = (description, change) => {
    const entry = { id: uid(), text: description, date: new Date().toISOString() }
    set((current) => ({ workspace: { ...current.workspace, ...change?.(current.workspace), audit: [entry, ...current.workspace.audit] } }))
  }
  switch (section) {
    case 'users':
      return <Panel title="Local profile">
        {state.user.name ? <><p className="font-bold">{state.user.name}</p><p>{state.user.email}</p></> : <p>No profile has been filled in.</p>}
      </Panel>
    case 'mentors':
      return <Panel title="Mentor directory">
        {!state.workspace.mentor && <p>No mentor profiles have been submitted.</p>}
        {state.workspace.mentor && [state.workspace.mentor].map((mentor) => {
          const status = state.workspace.mentorStatus[mentor.id] ?? 'Pending'
          return <div key={mentor.id} className="flex flex-wrap items-center gap-3 border-b border-border pb-2">
            <div className="flex-1"><p className="font-bold">{mentor.name}</p><p>{mentor.title}</p></div>
            <Select className="w-auto" aria-label={'Approval for ' + mentor.name} value={status} onChange={(event) => {
              const value = event.target.value
              update('Changed approval for ' + mentor.name + ' to ' + value, (workspace) => ({ mentorStatus: { ...workspace.mentorStatus, [mentor.id]: value } }))
            }}><option>Approved</option><option>Pending</option><option>Rejected</option></Select>
          </div>
        })}
      </Panel>
    case 'content':
      return <Grid cols={2}><Panel title="Academy catalogue">
        {skills.map((skill) => <p key={skill.slug}>{skill.name} · {skill.lessons.length} lessons</p>)}
      </Panel><Panel title="Library catalogue">
        {resources.map((resource) => <p key={resource.id}>{resource.title} · {resource.type}</p>)}
      </Panel></Grid>
    case 'broadcast':
      return <Panel title="In-app announcement">
        <TextForm label="Announcement" action="Publish announcement" multiline onSave={(value) => {
          notify({ title: 'LittleSteps announcement', body: value, type: 'system' })
          update('Published an announcement')
          toast.success('Announcement published')
        }} />
      </Panel>
    case 'reports': {
      const reported = state.posts.filter((post) => post.reported)
      return <Panel title="Reported community posts">
        {reported.length === 0 && <p>No posts awaiting review.</p>}
        {reported.map((post) => <div key={post.id} className="space-y-2 border-b border-border pb-3">
          <p className="font-bold">{post.author}</p><p>{post.body}</p>
          <div className="flex flex-wrap gap-2">
            <Btn variant="outline" onClick={() => {
              set((current) => ({ posts: current.posts.map((item) => item.id === post.id ? { ...item, reported: false } : item) }))
              update('Dismissed a report for ' + post.author)
            }}>Dismiss report</Btn>
            <Btn variant="danger" onClick={() => {
              set((current) => ({ posts: current.posts.filter((item) => item.id !== post.id) }))
              update('Removed a reported post by ' + post.author)
            }}>Remove post</Btn>
          </div>
        </div>)}
      </Panel>
    }
    case 'audit':
      return <Panel title="Administrative activity">
        {state.workspace.audit.length === 0 && <p>No admin actions recorded yet.</p>}
        {state.workspace.audit.map((entry) => <p key={entry.id}><time className="mr-3 text-sm text-muted-foreground" dateTime={entry.date}>{new Date(entry.date).toLocaleString()}</time>{entry.text}</p>)}
      </Panel>
    case 'support':
      return <Panel title="Contact requests from this browser">
        {state.workspace.support.length === 0 && <p>No support requests yet.</p>}
        {state.workspace.support.map((request) => <div key={request.id} className="space-y-2 border-b border-border pb-3">
          <p className="font-bold">{request.topic} · {request.name}</p><p>{request.email}</p><p>{request.message}</p>
          {request.resolved ? <Badge tone="mint">Resolved</Badge> : <Btn variant="outline" onClick={() => update('Resolved a support request', (workspace) => ({
            support: workspace.support.map((item) => item.id === request.id ? { ...item, resolved: true } : item),
          }))}>Mark resolved</Btn>}
        </div>)}
      </Panel>
    default:
      return null
  }
}

function MentorProfile() {
  const { state, set } = useStore()
  const profile = state.workspace.mentor
  const [form, setForm] = useState({
    name: profile?.name ?? '', title: profile?.title ?? '', bio: profile?.bio ?? '',
    expertise: profile?.expertise.join(', ') ?? '', time: profile?.slots[0] ?? '',
  })
  function submit(event: FormEvent) {
    event.preventDefault()
    const expertise = [...new Set(form.expertise.split(',').map((item) => item.trim()).filter(Boolean))]
    if (!form.name.trim() || !form.title.trim() || !expertise.length || !form.time) return
    const mentor = { id: profile?.id ?? uid(), name: form.name.trim(), title: form.title.trim(), bio: form.bio.trim(), expertise, slots: [form.time] }
    set((current) => ({
      workspace: { ...current.workspace, mentor, mentorStatus: { ...current.workspace.mentorStatus, [mentor.id]: 'Pending' } },
    }))
    toast.success('Mentor profile saved for approval')
  }
  return <Panel title="Mentor listing">
    {profile && <Badge>{state.workspace.mentorStatus[profile.id] ?? 'Pending'}</Badge>}
    <form className="flex flex-col gap-3" onSubmit={submit}>
      <Field label="Name">{(id) => <Input id={id} required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}</Field>
      <Field label="Professional title">{(id) => <Input id={id} required maxLength={100} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />}</Field>
      <Field label="Topics" hint="Separate multiple topics with commas.">{(id) => <Input id={id} required maxLength={240} value={form.expertise} onChange={(event) => setForm({ ...form, expertise: event.target.value })} />}</Field>
      <Field label="Available time">{(id) => <Input id={id} required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />}</Field>
      <Field label="Bio">{(id) => <Textarea id={id} maxLength={1000} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />}</Field>
      <Btn type="submit">Save for approval</Btn>
    </form>
  </Panel>
}
