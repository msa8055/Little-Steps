'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, CheckCircle2, Circle, Clock, Lightbulb, PlayCircle } from 'lucide-react'
import { Quiz } from '@/components/ls/quiz'
import { Btn, Card, CardTitle, Modal, PageHeader, Progress, TabPanels, Textarea } from '@/components/ls/ui'
import { skills } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

// A lesson should teach, not just award XP. These prompts turn every short
// lesson summary into a substantial, readable study guide with examples and
// a practical check-in for the learner.
function lessonGuide(title: string, summary: string, skillName: string) {
  return [
    `What this means: ${summary}`,
    `${title} is a skill you can practise in small moments, not a talent you either have or do not have.`,
    `Start by noticing how this skill appears in your own day at school, at home and online.`,
    'Pause before acting and name the goal you want to achieve.',
    'Break the goal into one action that can be finished in the next ten minutes.',
    'Choose a calm time and a place where you can give the task your full attention.',
    'Use simple, respectful words and ask questions when something is unclear.',
    'Look for evidence: what happened, what did you expect, and what was different?',
    'If another person is involved, listen to their point of view before deciding.',
    'Write down two possible choices instead of choosing the first idea immediately.',
    'Consider one short-term result and one longer-term result for each choice.',
    'Try the safest, kindest option and observe what changes.',
    'If the first attempt does not work, treat it as feedback and adjust one part.',
    'Ask a trusted adult, teacher or mentor for help when the situation is too big to handle alone.',
    `Example: use ${title.toLowerCase()} during a ${skillName.toLowerCase()} activity, then explain what you noticed.`,
    'Keep a tiny record: action, result, feeling and next step.',
    'Celebrate effort and improvement rather than waiting for a perfect result.',
    'Before you finish, teach the idea back in your own words to check your understanding.',
    'Today’s little step: practise once, reflect honestly, and choose one way to repeat it tomorrow.',
  ]
}

export default function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const skill = skills.find((s) => s.slug === slug)
  const { state, set, addXP, logHistory } = useStore()
  const [open, setOpen] = useState<number | null>(null)
  const [checked, setChecked] = useState<string[]>([])
  const [reflection, setReflection] = useState('')
  if (!skill) notFound()

  const key = (i: number) => `${skill.slug}-${i + 1}`
  const done = skill.lessons.filter((_, i) => state.completedLessons.includes(key(i))).length
  const bookmarked = state.bookmarks.includes(skill.slug)
  const complete = (i: number) => {
    if (!state.completedLessons.includes(key(i))) {
      set((s) => ({ completedLessons: [...s.completedLessons, key(i)], earnedBadges: s.earnedBadges.includes('first-step') ? s.earnedBadges : [...s.earnedBadges, 'first-step'] }))
      addXP(40, `Lesson complete: ${skill.lessons[i].title}`)
      logHistory({ kind: 'Lesson', title: skill.lessons[i].title, href: `/child/academy/${skill.slug}` })
    }
    setOpen(null)
  }

  const tabs = [
    { id: 'lessons', label: 'Lessons' },
    { id: 'activity', label: 'Activity' },
    { id: 'quiz', label: 'Quiz' },
  ]
  return (
    <div className="flex flex-col gap-6">
      <Btn href="/child/academy" variant="ghost" size="sm" className="w-fit">
        <ArrowLeft /> All skills
      </Btn>
      <PageHeader
        eyebrow="Life Skills Academy"
        title={skill.name}
        subtitle={skill.blurb}
        icon={skill.icon}
        tone={skill.tone}
        actions={
          <Btn variant={bookmarked ? 'secondary' : 'outline'} onClick={() => set((s) => ({ bookmarks: bookmarked ? s.bookmarks.filter((b) => b !== skill.slug) : [...s.bookmarks, skill.slug] }))}>
            <Bookmark className={cn(bookmarked && 'fill-current')} /> {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Btn>
        }
      />
      <Card className="flex flex-col gap-2">
        <div className="flex justify-between text-sm font-bold">
          <span>Your progress</span>
          <span>
            {done}/{skill.lessons.length} lessons
          </span>
        </div>
        <Progress value={(done / skill.lessons.length) * 100} tone={skill.tone} label="Skill progress" />
      </Card>
      <TabPanels
        tabs={tabs}
        panels={{
          lessons: (
            <ol className="flex flex-col gap-3">
              {skill.lessons.map((l, i) => {
                const isDone = state.completedLessons.includes(key(i))
                return (
                  <li key={l.title}>
                    <Card className="flex items-center gap-4">
                      {isDone ? <CheckCircle2 className="size-6 shrink-0 text-mint" aria-label="Completed" /> : <Circle className="size-6 shrink-0 text-muted-foreground" aria-label="Not completed" />}
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {i + 1}. {l.title}
                        </h3>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" aria-hidden /> {l.minutes} min
                        </p>
                      </div>
                      <Btn size="sm" variant={isDone ? 'outline' : 'primary'} onClick={() => setOpen(i)}>
                        <PlayCircle /> {isDone ? 'Review' : 'Start'}
                      </Btn>
                    </Card>
                  </li>
                )
              })}
            </ol>
          ),
          activity: (
            <Card className="flex flex-col gap-4">
              <CardTitle title="Try it today" icon={Lightbulb} tone="sun" sub={skill.activity.prompt} />
              <ul className="flex flex-col gap-2">
                {skill.activity.items.map((it) => (
                  <li key={it}>
                    <label className="flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-2.5 font-bold">
                      <input type="checkbox" className="size-4 accent-primary" checked={checked.includes(it)} onChange={() => setChecked(checked.includes(it) ? checked.filter((c) => c !== it) : [...checked, it])} />
                      {it}
                    </label>
                  </li>
                ))}
              </ul>
              <Textarea aria-label="Reflection" placeholder="What did you notice? How did it feel?" rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} />
              <Btn
                className="w-fit"
                disabled={checked.length < skill.activity.items.length}
                onClick={() => {
                  addXP(60, `Activity complete: ${skill.name}`)
                  logHistory({ kind: 'Activity', title: `${skill.name} activity` })
                  setChecked([])
                  setReflection('')
                }}
              >
                Submit activity
              </Btn>
            </Card>
          ),
          quiz: (
            <Quiz
              title={`${skill.name} quiz`}
              questions={skill.quiz}
              onFinish={(pct) => {
                addXP(Math.round(pct), `${skill.name} quiz: ${pct}%`)
                logHistory({ kind: 'Quiz', title: `${skill.name} quiz`, score: pct })
              }}
            />
          ),
        }}
      />
      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open !== null ? skill.lessons[open].title : ''}
        footer={open !== null && <Btn onClick={() => complete(open)}>Mark complete · +40 XP</Btn>}
      >
        {open !== null && (
          <div className="flex flex-col gap-4">
            <div className={cn('flex aspect-video items-center justify-center rounded-2xl bg-secondary')}>
              <skill.icon className="size-16 text-primary" aria-hidden />
            </div>
            <div className="flex flex-col gap-3 text-sm leading-relaxed">
              {lessonGuide(skill.lessons[open].title, skill.lessons[open].summary, skill.name).map((line, i) => (
                <p key={line} className="rounded-xl bg-muted/50 px-3 py-2"><strong className="mr-1 text-primary">{i + 1}.</strong>{line}</p>
              ))}
            </div>
            <div className="rounded-2xl bg-sun-soft p-4 text-sm">
              <strong>Little step:</strong> Try one idea from this lesson before the end of today, then come back and mark it done.
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
