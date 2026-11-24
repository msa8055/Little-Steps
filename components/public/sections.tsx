'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Baby, ChevronDown, GraduationCap, HeartPulse, PiggyBank, ShieldCheck, Briefcase, Palette, Users, UserRound, ShieldHalf, Gamepad2, Quote, Star } from 'lucide-react'
import { useState } from 'react'
import { Btn, Card, toneSoft, type Tone } from '@/components/ls/ui'
import { cn } from '@/lib/utils'

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } }

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-16 md:grid-cols-2 md:px-8 md:pt-16">
      <div className="flex flex-col gap-6">
        <motion.p {...fade} className="w-fit rounded-full bg-mint-soft px-3 py-1 text-sm font-extrabold text-accent-foreground">
          For curious minds aged 10–18
        </motion.p>
        <motion.h1 {...fade} transition={{ delay: 0.05, duration: 0.5 }} className="text-balance text-5xl font-semibold leading-[1.05] md:text-6xl">
          Every big journey starts with a <span className="text-primary">little step.</span>
        </motion.h1>
        <motion.p {...fade} transition={{ delay: 0.1, duration: 0.5 }} className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
          LittleSteps teaches the skills school often skips — speaking up, staying safe online, managing money, handling feelings and discovering a future you&apos;re excited about.
        </motion.p>
        <motion.div {...fade} transition={{ delay: 0.15, duration: 0.5 }} className="flex flex-wrap gap-3">
          <Btn href="/register" size="lg">
            Start your journey <ArrowRight />
          </Btn>
          <Btn href="/login" size="lg" variant="outline">
            Sign in
          </Btn>
        </motion.div>
        <Steps />
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
        <img src="/images/hero.png" alt="Children learning together and climbing colourful steps" className="w-full rounded-[2.5rem] border-4 border-card object-cover shadow-xl" />
        <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-lg md:-left-6">
          <img src="/images/littlebot.png" alt="" className="size-11 rounded-full bg-secondary" />
          <div>
            <p className="text-sm font-extrabold">LittleBot says</p>
            <p className="text-xs text-muted-foreground">&ldquo;Ready for your next little step?&rdquo;</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function Steps() {
  const steps = ['Learn', 'Practise', 'Grow', 'Shine']
  return (
    <ol className="mt-2 flex items-end gap-2" aria-label="The LittleSteps journey">
      {steps.map((s, i) => (
        <motion.li key={s} initial={{ height: 0, opacity: 0 }} animate={{ height: 36 + i * 18, opacity: 1 }} transition={{ delay: 0.3 + i * 0.12, type: 'spring' }} className={cn('flex w-20 items-start justify-center rounded-t-2xl pt-2 text-xs font-extrabold', ['bg-mint-soft text-accent-foreground', 'bg-sky-soft text-sky', 'bg-secondary text-secondary-foreground', 'bg-primary text-primary-foreground'][i])}>
          {s}
        </motion.li>
      ))}
    </ol>
  )
}

export const modules: { icon: typeof GraduationCap; title: string; body: string; tone: Tone }[] = [
  { icon: GraduationCap, title: 'Life Skills Academy', body: '15 skills from public speaking to conflict resolution, with bite-size lessons, quizzes and activities.', tone: 'primary' },
  { icon: ShieldCheck, title: 'Digital Safety', body: 'Practical guidance for privacy, phishing, passwords and respectful online communication.', tone: 'sky' },
  { icon: PiggyBank, title: 'Money Centre', body: 'Pocket-money tracker, savings goals, budget planner and a mini stock game.', tone: 'mint' },
  { icon: HeartPulse, title: 'Wellbeing', body: 'Mood tracker, breathing exercises, sleep and water logs, gratitude journal.', tone: 'rose' },
  { icon: Briefcase, title: 'Career Explorer', body: 'Interest quizzes, career cards, roadmaps and a dream-career vision board.', tone: 'sun' },
  { icon: Palette, title: 'Talent Centre', body: 'Showcase art, DIY, music and writing in a safe personal gallery.', tone: 'primary' },
  { icon: Gamepad2, title: 'Games & Scenarios', body: 'Branching real-life scenarios plus memory, word and safety escape-room games.', tone: 'sky' },
  { icon: Users, title: 'Mentors & Community', body: 'Browse approved mentor listings and join learning challenges.', tone: 'mint' },
]

export function Modules() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <SectionHead eyebrow="What's inside" title="One place to grow every part of you" body="Eight connected centres, one friendly journey. Progress in one area unlocks badges and rewards across the whole platform." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m, i) => (
          <motion.div key={m.title} {...fade} transition={{ delay: i * 0.05, duration: 0.4 }}>
            <Card className="h-full transition hover:-translate-y-1 hover:shadow-md">
              <span className={cn('flex size-12 items-center justify-center rounded-2xl', toneSoft[m.tone])}>
                <m.icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, body, center = true }: { eyebrow: string; title: string; body?: string; center?: boolean }) {
  return (
    <motion.div {...fade} className={cn('flex max-w-2xl flex-col gap-3', center && 'mx-auto text-center')}>
      <p className="text-xs font-extrabold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold md:text-4xl">{title}</h2>
      {body && <p className="text-pretty leading-relaxed text-muted-foreground">{body}</p>}
    </motion.div>
  )
}

const roles = [
  { icon: Baby, title: 'Children', body: 'Learn through games, earn XP and coins, and track your own growth map.', href: '/child', tone: 'primary' as Tone },
  { icon: UserRound, title: 'Parents', body: 'See progress, assign tasks, approve rewards and get weekly reports.', href: '/parent', tone: 'mint' as Tone },
  { icon: Users, title: 'Mentors', body: 'Run sessions, leave feedback and share resources with mentees.', href: '/mentor', tone: 'sky' as Tone },
  { icon: ShieldHalf, title: 'Admins', body: 'Manage users, approve mentors, publish content and keep everyone safe.', href: '/admin', tone: 'sun' as Tone },
]

export function Roles() {
  return (
    <section className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead eyebrow="Built for everyone" title="Four dashboards, one family of learners" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <Card key={r.title} className="flex flex-col gap-3">
              <span className={cn('flex size-12 items-center justify-center rounded-2xl', toneSoft[r.tone])}>
                <r.icon className="size-6" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              <Btn href={r.href} variant="secondary" size="sm" className="w-fit">
                Sign in <ArrowRight />
              </Btn>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const how = [
  { title: 'Create your profile', body: 'Pick your interests, age group and goals. Parents link with a family code.' },
  { title: 'Take little steps daily', body: 'Ten-minute lessons, quick quizzes and real-life scenarios that fit around school.' },
  { title: 'Earn and unlock', body: 'XP, coins, badges and streaks make progress feel like a game.' },
  { title: 'Watch yourself grow', body: 'Your Growth Map and reports show exactly how far you have come.' },
]
export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <SectionHead eyebrow="How it works" title="Small steps. Big confidence." />
      <ol className="mt-10 grid gap-4 md:grid-cols-4">
        {how.map((h, i) => (
          <motion.li key={h.title} {...fade} transition={{ delay: i * 0.08, duration: 0.4 }} className="relative rounded-3xl border border-border bg-card p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-heading text-lg font-semibold text-primary-foreground">{i + 1}</span>
            <h3 className="mt-4 text-lg font-semibold">{h.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

export function Testimonials() {
  return <section className="mx-auto max-w-7xl px-4 py-16"><SectionHead eyebrow="Community" title="Stories" body="No stories have been published yet." /></section>
}

export const faqs = [
  { q: 'Who is LittleSteps for?', a: 'Children aged 10 to 18, plus their parents, mentors and the admins who run the platform.' },
  { q: 'Is it safe for my child?', a: 'Profiles and activity are stored in this browser. The workspace includes tools for reporting posts and reviewing mentor listings.' },
  { q: 'How much time does it take?', a: 'Most lessons are 7–12 minutes. A daily 10-minute habit is enough to build a streak.' },
  { q: 'Do coins cost real money?', a: 'No. Coins are earned by learning and can only be spent in the rewards store. Real-world rewards are approved by parents.' },
  { q: 'Where is my progress saved?', a: 'Your progress is saved in this browser.' },
]
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <SectionHead eyebrow="FAQ" title="Questions grown-ups ask" />
      <div className="mt-8 flex flex-col gap-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="rounded-2xl border border-border bg-card">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold">
              {f.q}
              <ChevronDown className={cn('size-5 shrink-0 transition', open === i && 'rotate-180')} aria-hidden />
            </button>
            {open === i && <p className="px-5 pb-4 leading-relaxed text-muted-foreground">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <div className="flex flex-col items-center gap-5 rounded-[2.5rem] bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="text-balance text-3xl font-semibold md:text-5xl">Ready for your first little step?</h2>
        <p className="max-w-xl text-pretty leading-relaxed opacity-90">Create an account or sign in to your workspace.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Btn href="/register" size="lg" variant="sun">
            Create free account
          </Btn>
          <Btn href="/login" size="lg" variant="secondary">
            Sign in
          </Btn>
        </div>
      </div>
    </section>
  )
}

