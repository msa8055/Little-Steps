'use client'

import { Clock, Trophy, Users } from 'lucide-react'
import { useState } from 'react'
import { Badge, Btn, Card, Chip, PageHeader } from '@/components/ls/ui'
import { challenges } from '@/lib/data'
import { useStore } from '@/lib/store'

export default function Challenges() {
  const { state, set, addXP } = useStore()
  const [type, setType] = useState('All')
  const [mode, setMode] = useState('All')
  const list = challenges.filter((c) => (type === 'All' || c.type === type) && (mode === 'All' || c.mode === mode))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Play" title="Challenges" subtitle="Daily, weekly and monthly challenges — solo, with family or as a team." icon={Trophy} tone="sun" />
      <div className="flex flex-wrap gap-2">
        {['All', 'Daily', 'Weekly', 'Monthly'].map((t) => <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>)}
        <span className="mx-1 w-px bg-border" aria-hidden />
        {['All', 'Individual', 'Family', 'Team'].map((m) => <Chip key={m} active={mode === m} onClick={() => setMode(m)}>{m === 'All' ? 'Any mode' : m}</Chip>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => {
          const joined = state.joinedChallenges.includes(c.id)
          const done = state.joinedChallenges.includes(`${c.id}:done`)
          return (
            <Card key={c.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2"><Badge tone="sun">{c.type}</Badge><Badge tone="sky">{c.mode}</Badge><Badge tone="muted">{c.category}</Badge></div>
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                <span className="ml-auto text-primary">+{c.xp} XP</span>
              </div>
              {done ? (
                <Badge tone="mint">Completed</Badge>
              ) : joined ? (
                <div className="flex gap-2">
                  <Btn size="sm" variant="mint" onClick={() => { set((s) => ({ joinedChallenges: [...s.joinedChallenges, `${c.id}:done`] })); addXP(c.xp, `Challenge: ${c.title}`) }}>Mark complete</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => set((s) => ({ joinedChallenges: s.joinedChallenges.filter((j) => j !== c.id) }))}>Leave</Btn>
                </div>
              ) : (
                <Btn size="sm" onClick={() => set((s) => ({ joinedChallenges: [...s.joinedChallenges, c.id], earnedBadges: c.mode === 'Team' && !s.earnedBadges.includes('team-player') ? [...s.earnedBadges, 'team-player'] : s.earnedBadges }))}>Join challenge</Btn>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
