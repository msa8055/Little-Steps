'use client'

import Image from 'next/image'
import { Heart, Palette, Star, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { Btn, Card, Chip, Field, Input, Modal, PageHeader, Select, Textarea } from '@/components/ls/ui'
import { uid, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const cats = ['Art', 'Music', 'Writing', 'Photography', 'Craft', 'Coding']

export default function Talent() {
  const { state, set, addXP } = useStore()
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ title: '', category: 'Art', description: '', image: '' })
  const list = state.creations.filter((c) => cat === 'All' || c.category === cat)
  const onFile = (file?: File) => {
    if (!file) return
    if (file.size > 2_000_000) return alert('Please choose an image under 2 MB.')
    const r = new FileReader()
    r.onload = () => setF((x) => ({ ...x, image: String(r.result) }))
    r.readAsDataURL(file)
  }
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Play" title="Talent Centre" subtitle="Your personal gallery of creations." icon={Palette} tone="rose" actions={<Btn onClick={() => setOpen(true)}><Upload /> Upload</Btn>} />
      <div className="flex flex-wrap gap-2">{['All', ...cats].map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Card key={c.id} className="flex flex-col gap-3 overflow-hidden p-0">
            <div className="relative aspect-[4/3] bg-muted">
              {c.image && <Image src={c.image} alt={c.title} fill className="object-cover" sizes="(min-width:1280px) 33vw, 50vw" unoptimized={c.image.startsWith('data:')} />}
            </div>
            <div className="flex flex-col gap-2 px-5 pb-5">
              <div className="flex items-center gap-2">
                <h2 className="flex-1 font-semibold">{c.title}</h2>
                <button type="button" aria-label="Favourite" onClick={() => set((s) => ({ creations: s.creations.map((x) => (x.id === c.id ? { ...x, favourite: !x.favourite } : x)) }))}><Star className={cn('size-5', c.favourite ? 'fill-sun text-sun' : 'text-muted-foreground')} /></button>
              </div>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold">{c.category}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Heart className="size-4" aria-hidden />{c.likes}</span>
                <button type="button" aria-label="Delete" className="ml-auto text-muted-foreground hover:text-destructive" onClick={() => set((s) => ({ creations: s.creations.filter((x) => x.id !== c.id) }))}><Trash2 className="size-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Share a creation" footer={<Btn disabled={!f.title.trim() || !f.image} onClick={() => { set((s) => ({ creations: [{ id: uid(), ...f, likes: 0, favourite: false }, ...s.creations], earnedBadges: s.creations.length >= 4 && !s.earnedBadges.includes('creator') ? [...s.earnedBadges, 'creator'] : s.earnedBadges })); addXP(30, 'New creation uploaded'); setOpen(false); setF({ title: '', category: 'Art', description: '', image: '' }) }}>Upload</Btn>}>
        <div className="flex flex-col gap-3">
          <Field label="Image (max 2 MB)">{(id) => <input id={id} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" />}</Field>
          {f.image && <img src={f.image} alt="Preview" className="max-h-48 rounded-2xl object-contain" />}
          <Field label="Title">{(id) => <Input id={id} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />}</Field>
          <Field label="Category">{(id) => <Select id={id} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{cats.map((c) => <option key={c}>{c}</option>)}</Select>}</Field>
          <Field label="Description">{(id) => <Textarea id={id} rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />}</Field>
        </div>
      </Modal>
    </div>
  )
}
