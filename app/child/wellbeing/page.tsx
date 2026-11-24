'use client'

import { motion } from 'framer-motion'
import { Droplets, HeartPulse, Minus, Moon, Plus, Smartphone, Sparkles, Wind, Dumbbell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Btn, Card, CardTitle, PageHeader, Progress, TabPanels, Textarea } from '@/components/ls/ui'
import { affirmations, moodOptions } from '@/lib/data'
import { daysAgo, today, uid, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function MoodTracker() {
  const { state, set, addXP } = useStore()
  const todays = state.moods[today()]
  const days = Array.from({ length: 28 }, (_, i) => daysAgo(27 - i))
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="flex flex-col gap-4">
        <CardTitle title="How are you feeling today?" icon={HeartPulse} tone="rose" />
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {moodOptions.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={todays === m.id}
              onClick={() => {
                if (!todays) addXP(10, 'Mood logged')
                set((s) => ({ moods: { ...s.moods, [today()]: m.id } }))
              }}
              className={cn('flex flex-col items-center gap-1 rounded-2xl border-2 p-2 text-xs font-bold', todays === m.id ? 'border-primary bg-secondary' : 'border-transparent hover:bg-muted')}
            >
              <span className={cn('size-8 rounded-full', m.color)} aria-hidden />
              {m.label}
            </button>
          ))}
        </div>
        {todays && <p className="rounded-2xl bg-muted p-3 text-sm">Thanks for checking in. Every feeling is okay — noticing it is the first step.</p>}
      </Card>
      <Card>
        <CardTitle title="Mood calendar" sub="Last 4 weeks" />
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const m = moodOptions.find((x) => x.id === state.moods[d])
            return <div key={d} title={`${d}: ${m?.label ?? 'No entry'}`} className={cn('aspect-square rounded-lg', m ? m.color : 'bg-muted')} />
          })}
        </div>
      </Card>
    </div>
  )
}

const phases = [
  { label: 'Breathe in', s: 4, scale: 1.4 },
  { label: 'Hold', s: 4, scale: 1.4 },
  { label: 'Breathe out', s: 4, scale: 0.8 },
  { label: 'Hold', s: 4, scale: 0.8 },
]
function Breathing() {
  const { addXP } = useStore()
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [cycles, setCycles] = useState(0)
  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => {
      const next = (phase + 1) % 4
      setPhase(next)
      if (next === 0) {
        const c = cycles + 1
        setCycles(c)
        if (c >= 4) {
          setRunning(false)
          addXP(30, 'Breathing session complete')
        }
      }
    }, phases[phase].s * 1000)
    return () => clearTimeout(t)
  }, [running, phase, cycles, addXP])
  return (
    <Card className="flex flex-col items-center gap-6 py-10">
      <CardTitle title="Box breathing" icon={Wind} tone="sky" sub="4 rounds · about 1 minute" />
      <div className="flex size-64 items-center justify-center">
        <motion.div animate={{ scale: running ? phases[phase].scale : 1 }} transition={{ duration: phases[phase].s, ease: 'easeInOut' }} className="flex size-40 items-center justify-center rounded-full bg-sky-soft ring-8 ring-sky/20">
          <span className="font-heading text-xl font-semibold" aria-live="polite">{running ? phases[phase].label : cycles >= 4 ? 'Well done' : 'Ready?'}</span>
        </motion.div>
      </div>
      <p className="text-sm text-muted-foreground">Round {Math.min(cycles + 1, 4)} of 4</p>
      <Btn onClick={() => { setCycles(0); setPhase(0); setRunning(!running) }}>{running ? 'Stop' : 'Start'}</Btn>
    </Card>
  )
}

function Trackers() {
  const { state, set } = useStore()
  const day = today()
  const water = state.water[day] ?? 0
  const series = (records: Record<string, number>) => Array.from({ length: 7 }, (_, index) => {
    const date = daysAgo(6 - index)
    return { d: date.slice(5), v: records[date] ?? null }
  })
  const charts = [
    { title: 'Sleep (hours)', icon: Moon, data: state.sleep, color: 'var(--chart-1)', key: 'sleep' as const, goal: 9 },
    { title: 'Exercise (minutes)', icon: Dumbbell, data: state.exercise, color: 'var(--chart-3)', key: 'exercise' as const, goal: 60 },
    { title: 'Screen time (hours)', icon: Smartphone, data: state.screenTime, color: 'var(--chart-4)', key: 'screenTime' as const, goal: 2 },
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="flex flex-col gap-4">
        <CardTitle title="Water today" icon={Droplets} tone="sky" sub="Goal: 8 glasses" />
        <div className="flex flex-wrap gap-2" aria-label={`${water} of 8 glasses`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Droplets key={i} className={cn('size-8', i < water ? 'fill-sky text-sky' : 'text-muted-foreground')} aria-hidden />
          ))}
        </div>
        <div className="flex gap-2">
          <Btn size="sm" variant="outline" aria-label="Remove a glass" onClick={() => set((s) => ({ water: { ...s.water, [day]: Math.max(0, (s.water[day] ?? 0) - 1) } }))}><Minus /></Btn>
          <Btn size="sm" aria-label="Add a glass" onClick={() => set((s) => ({ water: { ...s.water, [day]: Math.min(12, (s.water[day] ?? 0) + 1) } }))}><Plus /> Glass</Btn>
        </div>
        <Progress value={(water / 8) * 100} tone="sky" label="Water goal" />
      </Card>
      {charts.map((c) => (
        <Card key={c.title}>
          <CardTitle title={c.title} icon={c.icon} sub={`Goal ${c.goal} · today ${c.data[day] ?? 'unlogged'}`} action={<Btn size="sm" variant="secondary" onClick={() => set((s) => ({ [c.key]: { ...s[c.key], [day]: (s[c.key][day] ?? 0) + (c.key === 'exercise' ? 10 : 0.5) } }))}><Plus /> Log</Btn>} />
          <div className="h-36">
            <ResponsiveContainer>
              <BarChart data={series(c.data)}><XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={12} /><Tooltip /><Bar dataKey="v" fill={c.color} radius={6} /></BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ))}
    </div>
  )
}

function Gratitude() {
  const { set, addXP } = useStore()
  const [items, setItems] = useState(['', '', ''])
  const [aff, setAff] = useState(0)
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="flex flex-col gap-3">
        <CardTitle title="Gratitude journal" icon={Sparkles} tone="sun" sub="Three good things today" />
        {items.map((v, i) => (
          <Textarea key={i} rows={2} aria-label={`Good thing ${i + 1}`} placeholder={`${i + 1}. I'm grateful for…`} value={v} onChange={(e) => setItems(items.map((x, j) => (j === i ? e.target.value : x)))} />
        ))}
        <Btn
          className="w-fit"
          disabled={items.some((x) => !x.trim())}
          onClick={() => {
            set((s) => ({ journal: [{ id: uid(), title: 'Gratitude', body: items.map((x, i) => `${i + 1}. ${x}`).join('\n'), mood: s.moods[today()] ?? 'happy', date: today(), favourite: false }, ...s.journal] }))
            addXP(20, 'Gratitude saved to journal')
            setItems(['', '', ''])
          }}
        >
          Save to journal
        </Btn>
      </Card>
      <Card className="flex flex-col items-center justify-center gap-4 bg-sun-soft text-center">
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Daily affirmation</p>
        <motion.p key={aff} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-2xl font-semibold text-balance">
          {affirmations[aff]}
        </motion.p>
        <Btn variant="outline" onClick={() => setAff((aff + 1) % affirmations.length)}>Another one</Btn>
      </Card>
    </div>
  )
}

export default function Wellbeing() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Wellbeing" subtitle="Look after your mind and body." icon={HeartPulse} tone="rose" />
      <TabPanels
        tabs={[{ id: 'mood', label: 'Mood' }, { id: 'breathe', label: 'Breathe' }, { id: 'track', label: 'Health trackers' }, { id: 'gratitude', label: 'Gratitude' }]}
        panels={{ mood: <MoodTracker />, breathe: <Breathing />, track: <Trackers />, gratitude: <Gratitude /> }}
      />
    </div>
  )
}
