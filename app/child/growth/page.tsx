'use client'

import Link from 'next/link'
import { CheckCircle2, Lock, Map, Star } from 'lucide-react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { Card, CardTitle, PageHeader, Progress, toneSoft } from '@/components/ls/ui'
import { skills } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function Growth() {
  const { state, level, levelProgress } = useStore()
  const pct = (slug: string, n: number) => (Array.from({ length: n }).filter((_, i) => state.completedLessons.includes(`${slug}-${i + 1}`)).length / n) * 100
  const radar = skills.map((skill) => ({ axis: skill.name, v: pct(skill.slug, skill.lessons.length) }))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Home" title="My Growth Map" subtitle="See how far you've come — one little step at a time." icon={Map} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-3">
          <CardTitle title={`Level ${level}`} icon={Star} tone="sun" sub={`${state.xp.toLocaleString()} XP total`} />
          <Progress value={levelProgress} label="Level progress" />
          <p className="text-sm text-muted-foreground">{Math.round(500 - (state.xp % 500))} XP to level {level + 1}</p>
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle title="Skill balance" />
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={radar}><PolarGrid /><PolarAngleAxis dataKey="axis" fontSize={12} /><Radar dataKey="v" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} /></RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle title="Your path" sub="Complete skills to light up the trail" />
        <ol className="relative flex flex-col gap-6 border-l-4 border-dashed border-border pl-8">
          {skills.map((s, i) => {
            const p = pct(s.slug, s.lessons.length)
            const unlocked = i === 0 || pct(skills[i - 1].slug, skills[i - 1].lessons.length) > 0 || p > 0 || i < 4
            return (
              <li key={s.slug} className="relative">
                <span className={cn('absolute top-1 -left-12 flex size-8 items-center justify-center rounded-full ring-4 ring-card', p === 100 ? 'bg-mint text-primary-foreground' : unlocked ? toneSoft[s.tone] : 'bg-muted text-muted-foreground')}>
                  {p === 100 ? <CheckCircle2 className="size-4" /> : unlocked ? <s.icon className="size-4" aria-hidden /> : <Lock className="size-4" aria-hidden />}
                </span>
                <Link href={unlocked ? `/child/academy/${s.slug}` : '#'} aria-disabled={!unlocked} className={cn('flex flex-col gap-1 rounded-2xl p-3 hover:bg-muted', !unlocked && 'pointer-events-none opacity-60')}>
                  <span className="font-bold">{s.name}</span>
                  <Progress value={p} tone={s.tone} label={`${s.name} progress`} className="max-w-sm" />
                </Link>
              </li>
            )
          })}
        </ol>
      </Card>
      <Card>
        <CardTitle title="Recent activity" />
        <ul className="flex flex-col divide-y divide-border">
          {state.history.slice(0, 8).map((h) => (
            <li key={h.id} className="flex items-center gap-3 py-2.5 text-sm"><span className="w-24 shrink-0 font-bold text-primary">{h.kind}</span><span className="flex-1">{h.title}</span>{h.score !== undefined && <span className="font-bold">{h.score}%</span>}<span className="text-xs text-muted-foreground">{h.date}</span></li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
