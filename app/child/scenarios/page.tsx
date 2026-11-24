'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Clock, GitBranch, Lightbulb, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge, Btn, Card, Chip, PageHeader, toneSoft } from '@/components/ls/ui'
import { scenarios, type Scenario } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function Player({ s, onExit }: { s: Scenario; onExit: () => void }) {
  const { addXP, logHistory } = useStore()
  const [nodeId, setNodeId] = useState(s.nodes[0].id)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [steps, setSteps] = useState(0)
  const [ended, setEnded] = useState(false)
  const [left, setLeft] = useState(s.timed)
  const node = s.nodes.find((n) => n.id === nodeId)!

  useEffect(() => {
    if (picked !== null || ended || !s.timed) return
    if (left <= 0) {
      setPicked(-1)
      return
    }
    const t = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(t)
  }, [left, picked, ended, s.timed])

  const choose = (i: number) => {
    setPicked(i)
    setScore(score + node.choices[i].score)
    setSteps(steps + 1)
  }
  const next = () => {
    const c = picked !== null && picked >= 0 ? node.choices[picked] : undefined
    if (c?.next) {
      setNodeId(c.next)
      setPicked(null)
      setLeft(s.timed)
    } else {
      setEnded(true)
      const pct = Math.round((score / Math.max(1, steps * 10)) * 100)
      addXP(Math.max(20, pct), `Scenario: ${s.title}`)
      logHistory({ kind: 'Scenario', title: s.title, score: pct })
    }
  }
  const pct = Math.round((score / Math.max(1, steps * 10)) * 100)

  if (ended)
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="font-heading text-5xl font-semibold text-primary">{pct}%</p>
        <h2 className="text-2xl font-semibold">Decision score</h2>
        <div className="flex max-w-lg gap-3 rounded-2xl bg-sun-soft p-4 text-left">
          <Lightbulb className="size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm leading-relaxed">{s.lesson}</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" onClick={onExit}><ArrowLeft /> All scenarios</Btn>
          <Btn onClick={() => { setNodeId(s.nodes[0].id); setPicked(null); setScore(0); setSteps(0); setEnded(false); setLeft(s.timed) }}><RotateCcw /> Replay</Btn>
        </div>
      </Card>
    )

  const choice = picked !== null && picked >= 0 ? node.choices[picked] : undefined
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Btn variant="ghost" size="sm" onClick={onExit}><ArrowLeft /> Exit</Btn>
        {s.timed > 0 && picked === null && <Badge tone={left <= 5 ? 'rose' : 'sky'}><Clock className="size-3" /> {left}s</Badge>}
      </div>
      <motion.p key={nodeId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-2xl font-semibold leading-snug text-balance">
        {node.text}
      </motion.p>
      <div className="flex flex-col gap-2">
        {node.choices.map((c, i) => (
          <button
            key={c.text}
            type="button"
            disabled={picked !== null}
            onClick={() => choose(i)}
            className={cn(
              'rounded-2xl border-2 p-4 text-left font-bold transition',
              picked === null && 'border-border hover:border-primary',
              picked === i && (c.score >= 7 ? 'border-mint bg-mint-soft' : c.score >= 4 ? 'border-sun bg-sun-soft' : 'border-destructive bg-rose-soft'),
              picked !== null && picked !== i && 'border-border opacity-50',
            )}
          >
            {c.text}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
          <p className="text-sm leading-relaxed">{choice ? choice.feedback : "Time's up! In real life, hesitating is a choice too. Let's continue."}</p>
          <Btn className="w-fit" onClick={next}>{choice?.next ? 'Continue' : 'See results'}</Btn>
        </div>
      )}
    </Card>
  )
}

export default function Scenarios() {
  const [cat, setCat] = useState('All')
  const [active, setActive] = useState<Scenario | null>(null)
  const cats = ['All', ...Array.from(new Set(scenarios.map((s) => s.category)))]
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Real-life Scenarios" subtitle="Choose your path. See what happens. Learn from every choice." icon={GitBranch} tone="sky" />
      {active ? (
        <Player s={active} onExit={() => setActive(null)} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">{cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {scenarios.filter((s) => cat === 'All' || s.category === cat).map((s) => (
              <Card key={s.id} className="flex flex-col gap-3">
                <span className={cn('w-fit rounded-full px-2.5 py-0.5 text-xs font-bold', toneSoft[s.tone])}>{s.category}</span>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="flex-1 text-sm text-muted-foreground line-clamp-3">{s.nodes[0].text}</p>
                <div className="flex items-center justify-between">
                  {s.timed > 0 ? <Badge tone="rose"><Clock className="size-3" /> Timed</Badge> : <span />}
                  <Btn size="sm" onClick={() => setActive(s)}>Play</Btn>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
