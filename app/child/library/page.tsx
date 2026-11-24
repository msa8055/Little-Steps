'use client'

import { Bookmark, Download, FileText, Library, PlayCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge, Btn, Card, Chip, Empty, Input, PageHeader, Pagination, Select, usePaged } from '@/components/ls/ui'
import { resourceCats, resources, resourceTypes } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function LibraryPage() {
  const { state, set, addXP } = useStore()
  const [q, setQ] = useState('')
  const [type, setType] = useState('All')
  const [cat, setCat] = useState('All')
  const [saved, setSaved] = useState(false)
  const list = resources.filter((r) => (type === 'All' || r.type === type) && (cat === 'All' || r.category === cat) && (!saved || state.bookmarks.includes(r.id)) && r.title.toLowerCase().includes(q.toLowerCase()))
  const { page, setPage, pages, slice: items } = usePaged(list, 9)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Resource Library" subtitle="Articles, videos, worksheets and guides." icon={Library} tone="sky" />
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input aria-label="Search resources" placeholder="Search resources…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <Select aria-label="Category" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1) }} className="w-44"><option>All</option>{resourceCats.map((c) => <option key={c}>{c}</option>)}</Select>
        <Chip active={saved} onClick={() => setSaved(!saved)}>Saved</Chip>
      </div>
      <div className="flex flex-wrap gap-2">{['All', ...resourceTypes].map((t) => <Chip key={t} active={type === t} onClick={() => { setType(t); setPage(1) }}>{t}</Chip>)}</div>
      {items.length === 0 ? (
        <Empty icon={Library} title="No resources found" body="Try a different search or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((r) => {
            const bm = state.bookmarks.includes(r.id)
            return (
              <Card key={r.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2"><Badge tone="sky">{r.type}</Badge><Badge tone="muted">{r.level}</Badge></div>
                  <button type="button" aria-label={bm ? 'Remove bookmark' : 'Bookmark'} onClick={() => set((s) => ({ bookmarks: bm ? s.bookmarks.filter((b) => b !== r.id) : [...s.bookmarks, r.id] }))}><Bookmark className={cn('size-5', bm ? 'fill-primary text-primary' : 'text-muted-foreground')} /></button>
                </div>
                <h2 className="flex-1 font-semibold">{r.title}</h2>
                <p className="text-xs text-muted-foreground">{r.category} · {r.minutes} min</p>
                <div className="flex gap-2">
                  <Btn size="sm" onClick={() => { addXP(15, `Read: ${r.title}`); set((s) => ({ recentlyViewed: [r.id, ...s.recentlyViewed.filter((x) => x !== r.id)].slice(0, 10) })) }}>{r.type === 'Video' ? <PlayCircle /> : <FileText />} Open</Btn>
                  <Btn size="sm" variant="outline" onClick={() => toast.success('Download started', { description: r.title })}><Download /> Save</Btn>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>
  )
}
