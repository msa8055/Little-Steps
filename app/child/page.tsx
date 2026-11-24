'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Award, BookOpen, CalendarClock, CheckCircle2, Circle, Coins, Flame, Gift, Quote, Target, Zap } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Badge, Btn, Card, CardTitle, Grid, Progress, Ring, Stat } from '@/components/ls/ui'
import { badges, quotes, skills } from '@/lib/data'
import { daysAgo, today, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function ChildDashboard() {
  const { state, set, addXP, level, levelProgress, hydrated } = useStore()
  if (!hydrated) return null
  const first = state.user.name.trim().split(' ')[0] || 'learner'
  const pendingTasks = state.tasks.filter((t) => !t.done).slice(0, 4)
  const nextSkill = skills.find((s) => s.lessons.some((_, i) => !state.completedLessons.includes(`${s.slug}-${i + 1}`)))
  const nextLesson = nextSkill?.lessons.find((_, i) => !state.completedLessons.includes(`${nextSkill.slug}-${i + 1}`))
  const booking = state.bookings.find((b) => b.status === 'upcoming')
  const mentor = booking && state.workspace.mentor?.id === booking.mentorId ? state.workspace.mentor : undefined
  const claimed = state.lastDailyReward === today()
  const quote = quotes[new Date().getDate() % quotes.length]
  const chart = Array.from({ length: 7 }, (_, index) => {
    const date = daysAgo(6 - index)
    return { d: date.slice(5), xp: state.xpByDay[date] ?? 0 }
  })

  return (
    <div className="flex flex-col gap-6">
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground md:grid-cols-[1fr_auto] md:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-extrabold uppercase tracking-widest opacity-80">Level {level} Explorer</p>
          <h1 className="text-balance text-3xl font-semibold md:text-4xl">Hi {first}, ready for today&apos;s little step?</h1>
          <p className="max-w-lg leading-relaxed opacity-90">
            {nextSkill && nextLesson ? <>Next up: <strong>{nextLesson.title}</strong> in {nextSkill.name} · {nextLesson.minutes} min</> : 'You’ve completed every academy lesson.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Btn href={nextSkill ? `/child/academy/${nextSkill.slug}` : "/child/academy"} variant="sun">
              {nextSkill ? 'Continue learning' : 'Revisit the academy'} <ArrowRight />
            </Btn>
            <Btn
              variant="secondary"
              disabled={claimed}
              onClick={() => {
                set(() => ({ lastDailyReward: today() }))
                addXP(50, 'Daily reward claimed', 20)
              }}
            >
              <Gift /> {claimed ? 'Reward claimed' : 'Claim daily reward'}
            </Btn>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-3xl bg-primary-foreground/10 p-4">
          <Ring value={levelProgress} size={110} stroke={10} color="var(--sun)">
            <span className="font-heading text-2xl font-semibold">{Math.round(levelProgress)}%</span>
            <span className="text-[11px] opacity-80">to Lv {level + 1}</span>
          </Ring>
          <div className="text-sm">
            <p className="font-extrabold">{500 - (state.xp % 500)} XP to go</p>
            
          </div>
        </div>
      </motion.section>

      <Grid cols={4}>
        <Stat label="Streak" value={`${state.streak} days`} icon={Flame} tone="sun" href="/child/rewards" hint={`${state.streakShields} shield ready`} />
        <Stat label="Total XP" value={state.xp.toLocaleString()} icon={Zap} tone="primary" href="/child/rewards" />
        <Stat label="Coins" value={state.coins} icon={Coins} tone="mint" href="/child/rewards" hint="Spend in the store" />
        <Stat label="Badges" value={`${state.earnedBadges.length}/${badges.length}`} icon={Award} tone="sky" href="/child/rewards" />
      </Grid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle title="Today's tasks" icon={CheckCircle2} tone="mint" action={<Btn href="/child/tasks" variant="ghost" size="sm">View all</Btn>} />
          <ul className="flex flex-col gap-2">
            {pendingTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-2.5">
                <button
                  type="button"
                  aria-label={`Mark ${t.title} done`}
                  onClick={() => {
                    set((s) => ({ tasks: s.tasks.map((x) => (x.id === t.id ? { ...x, done: true } : x)) }))
                    addXP(20, `Task done: ${t.title}`)
                  }}
                >
                  <Circle className="size-5 text-muted-foreground hover:text-primary" />
                </button>
                <span className="flex-1 font-bold">{t.title}</span>
                <Badge tone={t.priority === 'high' ? 'rose' : t.priority === 'medium' ? 'sun' : 'muted'}>{t.priority}</Badge>
              </li>
            ))}
            {pendingTasks.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">All done for today. Amazing!</p>}
          </ul>
        </Card>
        <Card className="flex flex-col gap-3 bg-sun-soft">
          <Quote className="size-7 text-primary" aria-hidden />
          <p className="font-heading text-xl font-semibold text-balance">&ldquo;{quote}&rdquo;</p>
          <p className="text-sm text-muted-foreground">Quote of the day</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle title="XP in the last 7 days" icon={Zap} sub={`${chart.reduce((total, day) => total + day.xp, 0)} XP earned`} />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Bar dataKey="xp" fill="var(--primary)" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle title="Upcoming session" icon={CalendarClock} tone="sky" />
          {booking && mentor ? (
            <div className="flex flex-col gap-3">
              <p className="font-heading text-lg font-semibold">{mentor.name}</p>
              <p className="text-sm text-muted-foreground">{booking.topic}</p>
              <Badge tone="sky">
                {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })} · {booking.time}
              </Badge>
              <Btn href="/child/mentors" variant="outline" size="sm" className="w-fit">Manage</Btn>
            </div>
          ) : (
            <Btn href="/child/mentors">Book a mentor</Btn>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle title="Your skill progress" icon={Target} action={<Btn href="/child/growth" variant="ghost" size="sm">Growth map</Btn>} />
        <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.slice(0, 9).map((s) => {
            const done = s.lessons.filter((_, i) => state.completedLessons.includes(`${s.slug}-${i + 1}`)).length
            return (
              <Link key={s.slug} href={`/child/academy/${s.slug}`} className="group flex items-center gap-3 rounded-2xl p-2 hover:bg-muted">
                <s.icon className="size-5 shrink-0 text-primary" aria-hidden />
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">
                      {done}/{s.lessons.length}
                    </span>
                  </div>
                  <Progress value={(done / s.lessons.length) * 100} tone={s.tone} className="mt-1" label={`${s.name} progress`} />
                </div>
              </Link>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardTitle title="Recent badges" icon={Award} tone="sun" />
        <div className="flex gap-3 overflow-x-auto pb-1">
          {badges.filter((b) => state.earnedBadges.includes(b.id)).map((b) => (
            <div key={b.id} className={cn('flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl p-3 text-center', 'bg-muted/60')}>
              <span className="flex size-12 items-center justify-center rounded-full bg-sun"><Award className="size-6" aria-hidden /></span>
              <span className="text-sm font-bold">{b.name}</span>
            </div>
          ))}
          <Link href="/child/library" className="flex w-32 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-3 text-center text-sm font-bold text-muted-foreground hover:border-primary">
            <BookOpen className="size-6" aria-hidden /> Earn more
          </Link>
        </div>
      </Card>
    </div>
  )
}

