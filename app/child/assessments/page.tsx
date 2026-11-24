'use client'

import { ArrowLeft, ClipboardCheck, Clock } from 'lucide-react'
import { useState } from 'react'
import { Quiz } from '@/components/ls/quiz'
import { Badge, Btn, Card, PageHeader, toneSoft } from '@/components/ls/ui'
import { assessments } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function Assessments() {
  const { state, addXP, logHistory } = useStore()
  const [active, setActive] = useState<string | null>(null)
  const a = assessments.find((x) => x.id === active)
  const best = (title: string) => Math.max(-1, ...state.history.filter((h) => h.kind === 'Assessment' && h.title === title).map((h) => h.score ?? 0))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Assessments" subtitle="Timed quizzes with instant feedback and printable results." icon={ClipboardCheck} />
      {a ? (
        <div className="flex flex-col gap-4">
          <Btn variant="ghost" size="sm" className="w-fit" onClick={() => setActive(null)}><ArrowLeft /> All assessments</Btn>
          <Quiz title={a.title} questions={a.questions} timed={a.minutes * 60} onFinish={(pct) => { addXP(Math.round(pct * 1.5), `${a.title}: ${pct}%`); logHistory({ kind: 'Assessment', title: a.title, score: pct, href: '/child/assessments' }) }} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assessments.map((x) => {
            const b = best(x.title)
            return (
              <Card key={x.id} className="flex flex-col gap-3">
                <span className={cn('w-fit rounded-full px-2.5 py-0.5 text-xs font-bold', toneSoft[x.tone])}>{x.skill}</span>
                <h2 className="text-lg font-semibold">{x.title}</h2>
                <p className="flex items-center gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Clock className="size-3" aria-hidden />{x.minutes} min</span>{x.questions.length} questions</p>
                <div className="mt-auto flex items-center justify-between">
                  {b >= 0 ? <Badge tone={b >= 80 ? 'mint' : 'sun'}>Best {b}%</Badge> : <Badge tone="muted">Not taken</Badge>}
                  <Btn size="sm" onClick={() => setActive(x.id)}>{b >= 0 ? 'Retake' : 'Start'}</Btn>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
