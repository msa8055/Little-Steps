'use client'

import { Briefcase, GraduationCap, Heart, Plus, Search, Star, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'
import { Badge, Btn, Card, CardTitle, Chip, Input, Modal, PageHeader, Progress, TabPanels } from '@/components/ls/ui'
import { careerCategories, careers, type Career } from '@/lib/data'
import { uid, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function Explorer({ onOpen }: { onOpen: (c: Career) => void }) {
  const { state, set } = useStore()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const list = careers.filter((c) => (cat === 'All' || c.category === cat) && c.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input aria-label="Search careers" placeholder="Search careers…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>
      <div className="flex flex-wrap gap-2">
        {['All', ...careerCategories].map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => {
          const fav = state.favourites.includes(c.id)
          return (
            <Card key={c.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <Badge tone="sun">{c.category}</Badge>
                <button type="button" aria-label={fav ? 'Remove favourite' : 'Add favourite'} onClick={() => set((s) => ({ favourites: fav ? s.favourites.filter((f) => f !== c.id) : [...s.favourites, c.id] }))}>
                  <Heart className={cn('size-5', fav ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
                </button>
              </div>
              <h3 className="text-lg font-semibold">{c.name}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
              <Btn size="sm" variant="secondary" onClick={() => onOpen(c)}>Explore</Btn>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const quizQs = [
  { q: 'On a free afternoon you would rather…', o: [['Build or code something', 'Technology'], ['Draw or make music', 'Creative'], ['Help a friend with a problem', 'Health'], ['Plan a small business', 'Business']] },
  { q: 'Your favourite subject is…', o: [['Maths / Computers', 'Technology'], ['Biology', 'Health'], ['Art / English', 'Creative'], ['Geography / EVS', 'Environment']] },
  { q: 'You feel proud when you…', o: [['Solve a tricky puzzle', 'Science'], ['Win a match', 'Sports'], ['Lead a team', 'Business'], ['Help your community', 'Public Service']] },
  { q: 'Pick a superpower', o: [['Talk to machines', 'Technology'], ['Heal anyone', 'Health'], ['Grow forests instantly', 'Environment'], ['Bring drawings to life', 'Creative']] },
]
function InterestQuiz({ onOpen }: { onOpen: (c: Career) => void }) {
  const [i, setI] = useState(0)
  const [tally, setTally] = useState<Record<string, number>>({})
  const { addXP } = useStore()
  if (i >= quizQs.length) {
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
    const matches = careers.filter((c) => c.category === top).slice(0, 3)
    return (
      <Card className="flex flex-col gap-4">
        <h3 className="text-2xl font-semibold">You lean towards <span className="text-primary">{top}</span></h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {matches.map((m) => (
            <button key={m.id} type="button" onClick={() => onOpen(m)} className="rounded-2xl bg-secondary p-4 text-left font-bold hover:bg-secondary/70">{m.name}</button>
          ))}
        </div>
        <Btn variant="outline" className="w-fit" onClick={() => { setI(0); setTally({}) }}>Retake</Btn>
      </Card>
    )
  }
  return (
    <Card className="flex flex-col gap-4">
      <Progress value={(i / quizQs.length) * 100} label="Quiz progress" />
      <h3 className="text-xl font-semibold">{quizQs[i].q}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {quizQs[i].o.map(([label, cat]) => (
          <button key={label} type="button" onClick={() => { setTally({ ...tally, [cat]: (tally[cat] ?? 0) + 1 }); if (i === quizQs.length - 1) addXP(40, 'Career interest quiz'); setI(i + 1) }} className="rounded-2xl border-2 border-border bg-card p-4 text-left font-bold hover:border-primary">
            {label}
          </button>
        ))}
      </div>
    </Card>
  )
}

const boardColors = ['bg-sun-soft', 'bg-mint-soft', 'bg-sky-soft', 'bg-rose-soft', 'bg-secondary']
function VisionBoard() {
  const { state, set } = useStore()
  const [text, setText] = useState('')
  const dream = careers.find((c) => c.id === state.dreamCareer)
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-center gap-3">
        <Star className="size-6 text-sun" aria-hidden />
        <p className="flex-1 font-bold">{dream ? `Dream career: ${dream.name}` : 'Pick a dream career from the explorer to pin it here.'}</p>
      </Card>
      <Card className="flex gap-2">
        <Input aria-label="Add to vision board" placeholder="Add a dream, goal or quote…" value={text} onChange={(e) => setText(e.target.value)} />
        <Btn disabled={!text.trim()} onClick={() => { set((s) => ({ visionBoard: [...s.visionBoard, { id: uid(), text, color: boardColors[s.visionBoard.length % boardColors.length] }] })); setText('') }}><Plus /> Add</Btn>
      </Card>
      <div className="columns-2 gap-3 md:columns-3">
        {state.visionBoard.map((v, i) => (
          <div key={v.id} className={cn('relative mb-3 break-inside-avoid rounded-3xl p-5 font-heading text-lg font-semibold', v.color, i % 2 ? '-rotate-1' : 'rotate-1')}>
            {v.text}
            <button type="button" aria-label="Remove" onClick={() => set((s) => ({ visionBoard: s.visionBoard.filter((x) => x.id !== v.id) }))} className="absolute top-2 right-2 rounded-full p-1 hover:bg-card/60"><X className="size-4" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Careers() {
  const { state, set, addXP } = useStore()
  const [open, setOpen] = useState<Career | null>(null)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Career Explorer" subtitle="Discover what you could become." icon={Briefcase} tone="sun" />
      <TabPanels
        tabs={[{ id: 'explore', label: 'Explore' }, { id: 'quiz', label: 'Interest quiz' }, { id: 'board', label: 'Vision board' }]}
        panels={{ explore: <Explorer onOpen={setOpen} />, quiz: <InterestQuiz onOpen={setOpen} />, board: <VisionBoard /> }}
      />
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} size="lg" footer={open && <Btn onClick={() => { set(() => ({ dreamCareer: open.id })); addXP(20, `Dream career: ${open.name}`); setOpen(null) }}><Star /> {state.dreamCareer === open.id ? 'Your dream career' : 'Set as dream career'}</Btn>}>
        {open && (
          <div className="flex flex-col gap-5">
            <p className="leading-relaxed">{open.blurb}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-sky-soft p-3"><p className="flex items-center gap-1 text-xs font-bold text-muted-foreground"><GraduationCap className="size-3" />Education</p><p className="font-bold">{open.education}</p></div>
            </div>
            <div><p className="mb-2 font-bold">Key skills</p><div className="flex flex-wrap gap-2">{open.skills.map((s) => <Badge key={s}>{s}</Badge>)}</div></div>
            <div>
              <CardTitle title="Your roadmap" />
              <ol className="flex flex-col gap-2">
                {open.path.map((p, i) => (
                  <li key={p} className="flex items-center gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>{p}</li>
                ))}
              </ol>
            </div>
            <p className="text-sm text-muted-foreground">Role model: <strong className="text-foreground">{open.roleModel}</strong></p>
          </div>
        )}
      </Modal>
    </div>
  )
}
