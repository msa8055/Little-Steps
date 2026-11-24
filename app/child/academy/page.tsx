'use client'

import Link from 'next/link'
import { Bookmark, GraduationCap, Search } from 'lucide-react'
import { useState } from 'react'
import { Badge, Card, Input, PageHeader, Progress, toneSoft } from '@/components/ls/ui'
import { skills } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function Academy() {
  const { state } = useStore()
  const [q, setQ] = useState('')
  const list = skills.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.blurb.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Life Skills Academy" subtitle={`${skills.length} skills · bite-size lessons, activities and quizzes`} icon={GraduationCap} />
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input aria-label="Search skills" placeholder="Search skills…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => {
          const done = s.lessons.filter((_, i) => state.completedLessons.includes(`${s.slug}-${i + 1}`)).length
          const pct = (done / s.lessons.length) * 100
          return (
            <Link key={s.slug} href={`/child/academy/${s.slug}`} className="group">
              <Card className="flex h-full flex-col gap-3 transition group-hover:-translate-y-1 group-hover:shadow-md">
                <div className="flex items-start justify-between">
                  <span className={cn('flex size-12 items-center justify-center rounded-2xl', toneSoft[s.tone])}>
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <div className="flex items-center gap-2">
                    {state.bookmarks.includes(s.slug) && <Bookmark className="size-4 fill-primary text-primary" aria-label="Bookmarked" />}
                    <Badge tone={pct === 100 ? 'mint' : pct > 0 ? 'sun' : 'muted'}>{pct === 100 ? 'Completed' : pct > 0 ? 'In progress' : 'New'}</Badge>
                  </div>
                </div>
                <h2 className="text-lg font-semibold">{s.name}</h2>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                <div>
                  <div className="mb-1 flex justify-between text-xs font-bold text-muted-foreground">
                    <span>{s.lessons.length} lessons</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                  <Progress value={pct} tone={s.tone} label={`${s.name} progress`} />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
