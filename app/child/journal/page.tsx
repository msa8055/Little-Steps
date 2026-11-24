'use client'

import { BookHeart, Heart, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Btn, Card, Chip, Confirm, Empty, Field, Input, Modal, PageHeader, Textarea } from '@/components/ls/ui'
import { moodOptions } from '@/lib/data'
import { today, uid, useStore, type JournalEntry } from '@/lib/store'
import { cn } from '@/lib/utils'

const prompts = ['What made you smile today?', 'What is one thing you learned?', 'Who helped you today, and how?', 'What would make tomorrow great?', 'Describe a challenge you faced.']

export default function Journal() {
  const { state, set, addXP } = useStore()
  const [q, setQ] = useState('')
  const [favOnly, setFavOnly] = useState(false)
  const [edit, setEdit] = useState<JournalEntry | null>(null)
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState<string | null>(null)
  const [f, setF] = useState({ title: '', body: '', mood: 'happy' })
  const list = state.journal.filter((j) => (!favOnly || j.favourite) && (j.title + j.body).toLowerCase().includes(q.toLowerCase()))
  const openEditor = (j?: JournalEntry, prompt?: string) => {
    setEdit(j ?? null)
    setF(j ? { title: j.title, body: j.body, mood: j.mood } : { title: prompt ?? '', body: '', mood: 'happy' })
    setOpen(true)
  }
  const save = () => {
    if (!f.title.trim() || !f.body.trim()) return
    if (edit) set((s) => ({ journal: s.journal.map((j) => (j.id === edit.id ? { ...j, ...f } : j)) }))
    else {
      set((s) => ({ journal: [{ id: uid(), ...f, date: today(), favourite: false }, ...s.journal] }))
      addXP(20, 'Journal entry written')
    }
    setOpen(false)
  }
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Organise" title="My Journal" subtitle="A private space for your thoughts." icon={BookHeart} tone="rose" actions={<Btn onClick={() => openEditor()}><Plus /> New entry</Btn>} />
      <Card className="flex flex-col gap-3">
        <p className="text-sm font-bold">Need a prompt?</p>
        <div className="flex flex-wrap gap-2">{prompts.map((p) => <Chip key={p} onClick={() => openEditor(undefined, p)}>{p}</Chip>)}</div>
      </Card>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input aria-label="Search journal" placeholder="Search entries…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Chip active={favOnly} onClick={() => setFavOnly(!favOnly)}>Favourites</Chip>
      </div>
      {list.length === 0 ? (
        <Empty icon={BookHeart} title="No entries yet" body="Write your first entry — even one sentence counts." action={<Btn onClick={() => openEditor()}>Start writing</Btn>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((j) => {
            const m = moodOptions.find((x) => x.id === j.mood)
            return (
              <Card key={j.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={cn('size-3 rounded-full', m?.color ?? 'bg-muted')} aria-hidden />
                  <span className="text-xs font-bold text-muted-foreground">{j.date} · {m?.label}</span>
                  <button type="button" aria-label={j.favourite ? 'Unfavourite' : 'Favourite'} className="ml-auto" onClick={() => set((s) => ({ journal: s.journal.map((x) => (x.id === j.id ? { ...x, favourite: !x.favourite } : x)) }))}>
                    <Heart className={cn('size-4', j.favourite ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
                  </button>
                </div>
                <h2 className="text-lg font-semibold">{j.title}</h2>
                <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground line-clamp-5">{j.body}</p>
                <div className="flex gap-1">
                  <Btn size="sm" variant="ghost" onClick={() => openEditor(j)}><Pencil /> Edit</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setDel(j.id)}><Trash2 /> Delete</Btn>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Edit entry' : 'New entry'} size="lg" footer={<Btn disabled={!f.title.trim() || !f.body.trim()} onClick={save}>Save entry</Btn>}>
        <div className="flex flex-col gap-3">
          <Field label="Title">{(id) => <Input id={id} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />}</Field>
          <fieldset>
            <legend className="mb-2 text-sm font-bold">Mood</legend>
            <div className="flex flex-wrap gap-2">{moodOptions.map((m) => <Chip key={m.id} active={f.mood === m.id} onClick={() => setF({ ...f, mood: m.id })}>{m.label}</Chip>)}</div>
          </fieldset>
          <Field label="Your thoughts">{(id) => <Textarea id={id} rows={8} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />}</Field>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} onConfirm={() => set((s) => ({ journal: s.journal.filter((j) => j.id !== del) }))} title="Delete this entry?" body="This can't be undone." confirmLabel="Delete" danger />
    </div>
  )
}
