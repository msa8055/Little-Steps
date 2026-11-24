'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { quotes, skills } from '@/lib/data'
import { useStore, type State } from '@/lib/store'

type Msg = { from: 'bot' | 'me'; text: string; link?: { href: string; label: string } }

function reply(question: string, state: State): Omit<Msg, 'from'> {
  const q = question.toLowerCase()
  if (/\b(xp|coins?|points?|streak|progress)\b/.test(q)) {
    return { text: `You have ${state.xp} XP, ${state.coins} coins and ${state.completedLessons.length} completed lessons.`, link: { href: '/child/growth', label: 'Growth Map' } }
  }
  if (/\b(learn|lesson|academy|recommend|study)\w*\b/.test(q)) {
    for (const skill of skills) {
      const lesson = skill.lessons.find((_, i) => !state.completedLessons.includes(skill.slug + '-' + (i + 1)))
      if (lesson) return { text: `Try “${lesson.title}” in ${skill.name}. It takes about ${lesson.minutes} minutes.`, link: { href: '/child/academy/' + skill.slug, label: 'Open module' } }
    }
    return { text: 'You’ve completed every academy lesson. You can revisit a favourite or try an assessment.', link: { href: '/child/assessments', label: 'Assessments' } }
  }
  if (/\b(task|homework|planner)\w*\b/.test(q)) {
    const count = state.tasks.filter((task) => !task.done).length
    return { text: count ? `You have ${count} open ${count === 1 ? 'task' : 'tasks'}. Start with one small step.` : 'Your planner has no open tasks. Add one whenever you need it.', link: { href: '/child/tasks', label: 'Open planner' } }
  }
  if (/\b(money|sav(e|ing|ings)|budget|spend)\b/.test(q)) {
    const goal = state.savingsGoals.find((item) => item.saved < item.target)
    return { text: goal ? `You’ve saved ₹${goal.saved} of ₹${goal.target} for ${goal.name}. Decide how much you can set aside next.` : 'Start with a savings goal and an amount you can set aside regularly.', link: { href: '/child/finance', label: 'Money Centre' } }
  }
  if (/\b(career|job|future)\w*\b/.test(q)) {
    return { text: state.user.interests.length ? `Look for roles that use skills from your interests: ${state.user.interests.join(', ')}. Pick one role and read about its daily work.` : 'Pick an activity you enjoy and explore which careers use those skills.', link: { href: '/child/careers', label: 'Explore careers' } }
  }
  if (/\b(safe|safety|scam|password|online)\w*\b/.test(q)) {
    return { text: 'If a message pressures you to click a link or share a code, pause and check with a trusted adult.', link: { href: '/child/safety', label: 'Digital Safety Centre' } }
  }
  if (/\b(sad|stress|anxious|nervous|worried|overwhelmed)\w*\b/.test(q)) {
    return { text: 'Take a slow breath and give yourself a moment. If this feels difficult to handle, tell a trusted adult how you’re feeling.', link: { href: '/child/wellbeing', label: 'Wellbeing' } }
  }
  if (/\b(friend|conflict|argu|fight)\w*\b/.test(q)) return { text: 'Try saying “I feel … when … because …” to explain how something affected you.' }
  if (/\b(motivat|quote|inspir)\w*\b/.test(q)) return { text: quotes[new Date().getDate() % quotes.length] }
  if (/\b(game|play|bored)\w*\b/.test(q)) return { text: 'Try memory matching, word scramble, typing or a times-table sprint.', link: { href: '/child/games', label: 'Games Arcade' } }
  if (/^(hi|hey|hello)[!. ]*$/i.test(question)) return { text: 'Hi! How can I help you with LittleSteps?' }
  return { text: 'I can help with LittleSteps lessons, tasks, progress, savings, careers, online safety, wellbeing and games. Pick a topic below or ask about one.' }
}

const suggestions = ['What should I learn today?', 'Give me a safety tip', 'Help me save money', 'I feel nervous', 'Career ideas for me', 'Motivate me!']

export function LittleBot() {
  const { state } = useStore()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Hi! I\u2019m LittleBot, your learning buddy. Ask me about lessons, careers, money, safety or feelings!' }])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [open, msgs])

  const ask = (text: string) => {
    const question = text.trim()
    if (!question) return
    setMsgs((messages) => [...messages, { from: 'me', text: question }, { from: 'bot', ...reply(question, state) }])
    setInput('')
  }

  return (
    <div className="no-print fixed right-4 bottom-4 z-[70] md:right-6 md:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="LittleBot assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 flex h-[min(520px,75vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <header className="flex items-center gap-3 bg-primary p-4 text-primary-foreground">
              <img src="/images/littlebot.png" alt="" className="size-10 rounded-full bg-card object-cover" />
              <div className="flex-1">
                <p className="font-heading font-semibold">LittleBot</p>
                <p className="text-xs opacity-80">Learning assistant</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close LittleBot" className="rounded-lg p-1 hover:bg-primary-foreground/15">
                <X className="size-5" />
              </button>
            </header>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={m.from === 'me' ? 'self-end' : 'self-start'}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${m.from === 'me' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {m.text}
                    {m.link && (
                      <Link href={m.link.href} onClick={() => setOpen(false)} className="mt-2 block font-bold text-primary underline underline-offset-2">
                        {m.link.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="flex gap-1.5 overflow-x-auto px-3 pb-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)} className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-bold hover:bg-secondary">
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault()
                ask(input)
              }}
            >
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask LittleBot…" aria-label="Message LittleBot" maxLength={400} className="h-10 flex-1 rounded-xl border-2 border-input bg-card px-3 text-sm outline-none focus:border-primary" />
              <button type="submit" aria-label="Send" className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Send className="size-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close LittleBot' : 'Open LittleBot assistant'}
        className="ml-auto flex size-16 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-secondary shadow-xl"
      >
        <img src="/images/littlebot.png" alt="" className="size-full object-cover" />
      </motion.button>
    </div>
  )
}


