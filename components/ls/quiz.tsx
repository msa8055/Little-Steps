'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Printer, RotateCcw, XCircle, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Q } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Btn, Progress, Ring } from './ui'

export function Quiz({ questions, onFinish, timed, title }: { questions: Q[]; onFinish?: (pct: number, correct: number) => void; timed?: number; title?: string }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [done, setDone] = useState(false)
  const [left, setLeft] = useState(timed ?? 0)

  useEffect(() => {
    if (!timed || done) return
    if (left <= 0) {
      finish([...answers, ...Array(questions.length - answers.length).fill(null)])
      return
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
  })

  const finish = (all: (number | null)[]) => {
    setAnswers(all)
    setDone(true)
    const correct = all.filter((a, idx) => a === questions[idx].answer).length
    onFinish?.(Math.round((correct / questions.length) * 100), correct)
  }

  const next = () => {
    const all = [...answers, picked]
    if (i + 1 >= questions.length) finish(all)
    else {
      setAnswers(all)
      setI(i + 1)
      setPicked(null)
    }
  }

  const restart = () => {
    setI(0)
    setPicked(null)
    setAnswers([])
    setDone(false)
    setLeft(timed ?? 0)
  }

  if (done) {
    const correct = answers.filter((a, idx) => a === questions[idx].answer).length
    const pct = Math.round((correct / questions.length) * 100)
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <Ring value={pct} size={140} color={pct >= 70 ? 'var(--mint)' : 'var(--sun)'}>
            <span className="font-heading text-3xl font-semibold">{pct}%</span>
            <span className="text-xs text-muted-foreground">
              {correct}/{questions.length} correct
            </span>
          </Ring>
          <p className="flex items-center gap-2 font-heading text-xl font-semibold">
            <Trophy className="size-5 text-sun" aria-hidden />
            {pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Good effort!' : 'Keep practising!'}
          </p>
        </div>
        <ol className="flex flex-col gap-2">
          {questions.map((q, idx) => {
            const ok = answers[idx] === q.answer
            return (
              <li key={q.q} className={cn('rounded-2xl border-2 p-3 text-sm', ok ? 'border-mint bg-mint-soft' : 'border-destructive/40 bg-destructive/5')}>
                <p className="flex items-start gap-2 font-bold">
                  {ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent-foreground" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />}
                  {q.q}
                </p>
                <p className="mt-1 pl-6 text-muted-foreground">
                  Answer: <strong className="text-foreground">{q.options[q.answer]}</strong> — {q.explain}
                </p>
              </li>
            )
          })}
        </ol>
        <div className="no-print flex flex-wrap justify-center gap-2">
          <Btn variant="outline" onClick={restart}>
            <RotateCcw /> Try again
          </Btn>
          <Btn variant="secondary" onClick={() => window.print()}>
            <Printer /> Download results
          </Btn>
        </div>
        {title && <p className="hidden text-center text-sm print:block">LittleSteps · {title} · {new Date().toLocaleDateString()}</p>}
      </div>
    )
  }

  const q = questions[i]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 text-sm font-bold text-muted-foreground">
        <span>
          Question {i + 1} of {questions.length}
        </span>
        {timed ? (
          <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-1', left <= 10 ? 'bg-destructive/10 text-destructive' : 'bg-muted')}>
            <Clock className="size-4" aria-hidden /> {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
          </span>
        ) : null}
      </div>
      <Progress value={(i / questions.length) * 100} />
      <motion.h3 key={q.q} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-semibold text-balance">
        {q.q}
      </motion.h3>
      <div className="grid gap-2">
        {q.options.map((o, idx) => {
          const show = picked !== null
          const correct = idx === q.answer
          return (
            <button
              key={o}
              type="button"
              disabled={show}
              onClick={() => setPicked(idx)}
              className={cn(
                'flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left font-bold transition',
                !show && 'border-border hover:border-primary hover:bg-secondary',
                show && correct && 'border-mint bg-mint-soft',
                show && picked === idx && !correct && 'border-destructive bg-destructive/10',
                show && !correct && picked !== idx && 'border-border opacity-60',
              )}
            >
              {o}
              {show && correct && <CheckCircle2 className="size-5 text-accent-foreground" aria-label="Correct" />}
              {show && picked === idx && !correct && <XCircle className="size-5 text-destructive" aria-label="Incorrect" />}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 rounded-2xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed">
            <strong>{picked === q.answer ? 'Correct! ' : 'Not quite. '}</strong>
            {q.explain}
          </p>
          <Btn onClick={next}>{i + 1 >= questions.length ? 'See results' : 'Next question'}</Btn>
        </motion.div>
      )}
    </div>
  )
}
