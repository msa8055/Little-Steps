'use client'

import { AlertTriangle, CheckCircle2, KeyRound, Mail, ShieldCheck, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Quiz } from '@/components/ls/quiz'
import { Badge, Btn, Card, CardTitle, Input, PageHeader, Progress, TabPanels, toneSoft } from '@/components/ls/ui'
import { assessments, safetyTopics } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function PasswordChecker() {
  const [pw, setPw] = useState('')
  const checks = [
    { ok: pw.length >= 12, label: 'At least 12 characters' },
    { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), label: 'Upper and lower case' },
    { ok: /\d/.test(pw), label: 'Contains a number' },
    { ok: /[^A-Za-z0-9]/.test(pw), label: 'Contains a symbol' },
    { ok: pw.length > 0 && !/(password|1234|qwerty|name|abc)/i.test(pw), label: 'No common words or patterns' },
  ]
  const score = checks.filter((c) => c.ok).length
  const label = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Super strong'][score]
  const crackTime = ['instantly', 'seconds', 'minutes', 'days', 'years', 'centuries'][score]
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Password strength checker" icon={KeyRound} sub="Nothing you type leaves your device." />
      <Input aria-label="Test a password" placeholder="Type a password to test…" value={pw} onChange={(e) => setPw(e.target.value)} />
      <Progress value={(score / 5) * 100} tone={score >= 4 ? 'mint' : score >= 2 ? 'sun' : 'rose'} label="Password strength" />
      <p className="font-bold">
        {label} · could be cracked in <span className="text-primary">{crackTime}</span>
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-sm">
            {c.ok ? <CheckCircle2 className="size-4 text-mint" aria-hidden /> : <XCircle className="size-4 text-muted-foreground" aria-hidden />}
            {c.label}
          </li>
        ))}
      </ul>
    </Card>
  )
}

const messages = [
  { from: 'Amazon Prizes <win@amaz0n-gifts.xyz>', subject: 'You WON an iPhone 17! Claim in 10 minutes', scam: true, why: 'Misspelled domain, urgency and a prize you never entered for.' },
  { from: 'Ms. Rao <rao@dps-school.edu.in>', subject: 'Science project deadline moved to Friday', scam: false, why: 'Known sender, school domain, no requests for info.' },
  { from: 'Instagram Support <security@insta-verify.co>', subject: 'Your account will be deleted — verify password now', scam: true, why: 'Real platforms never ask for your password by email.' },
  { from: 'Bank Alerts <alerts@sbi-kyc-update.info>', subject: 'KYC pending. Share OTP to avoid account block', scam: true, why: 'Banks never ask for OTPs. Odd domain and threat.' },
  { from: 'Grandma <nani.mehta@gmail.com>', subject: 'Photos from Diwali', scam: false, why: 'Familiar contact, normal message, nothing suspicious requested.' },
  { from: 'FreeFire Diamonds <gift@ff-diamond-gen.com>', subject: 'Get 10,000 free diamonds — enter your login', scam: true, why: 'Game currency generators are always scams.' },
]
function ScamSimulator() {
  const { addXP, set } = useStore()
  const [i, setI] = useState(0)
  const [result, setResult] = useState<null | boolean>(null)
  const [score, setScore] = useState(0)
  const m = messages[i]
  const done = i >= messages.length
  const guess = (scam: boolean) => {
    const right = scam === m.scam
    setResult(right)
    if (right) setScore(score + 1)
  }
  if (done)
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <ShieldCheck className="size-12 text-mint" aria-hidden />
        <h3 className="text-2xl font-semibold">
          You scored {score}/{messages.length}
        </h3>
        <p className="text-muted-foreground">{score >= 5 ? 'Scam Buster badge unlocked!' : 'Practice makes perfect. Try again!'}</p>
        <Btn onClick={() => { setI(0); setScore(0); setResult(null) }}>Play again</Btn>
      </Card>
    )
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Phishing & scam simulator" icon={Mail} tone="rose" sub={`Message ${i + 1} of ${messages.length} · Score ${score}`} />
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="text-xs text-muted-foreground">From: {m.from}</p>
        <p className="mt-1 font-bold">{m.subject}</p>
      </div>
      {result === null ? (
        <div className="grid grid-cols-2 gap-3">
          <Btn variant="danger" onClick={() => guess(true)}>
            <AlertTriangle /> It&apos;s a scam
          </Btn>
          <Btn variant="mint" onClick={() => guess(false)}>
            <CheckCircle2 /> Looks safe
          </Btn>
        </div>
      ) : (
        <div className={cn('flex flex-col gap-3 rounded-2xl p-4', result ? 'bg-mint-soft' : 'bg-rose-soft')}>
          <p className="font-bold">{result ? 'Correct!' : 'Not quite.'} This message is {m.scam ? 'a scam' : 'safe'}.</p>
          <p className="text-sm">{m.why}</p>
          <Btn
            className="w-fit"
            onClick={() => {
              setResult(null)
              if (i === messages.length - 1) {
                addXP(score * 15, 'Scam simulator complete')
                if (score >= 5) set((s) => ({ earnedBadges: s.earnedBadges.includes('scam-buster') ? s.earnedBadges : [...s.earnedBadges, 'scam-buster'] }))
              }
              setI(i + 1)
            }}
          >
            Next
          </Btn>
        </div>
      )}
    </Card>
  )
}

const urls = [
  { url: 'https://www.paytm.com/login', safe: true },
  { url: 'http://paytm-login.secure-verify.ru', safe: false },
  { url: 'https://accounts.google.com', safe: true },
  { url: 'https://g00gle.com-signin.net', safe: false },
]
function UrlChecker() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle title="Fake website detector" icon={AlertTriangle} tone="sun" sub="Is this link real or fake?" />
      {urls.map((u, i) => (
        <div key={u.url} className="flex flex-wrap items-center gap-3 rounded-2xl bg-muted/60 p-3">
          <code className="flex-1 break-all text-sm">{u.url}</code>
          {answers[i] === undefined ? (
            <div className="flex gap-2">
              <Btn size="sm" variant="mint" onClick={() => setAnswers({ ...answers, [i]: true })}>Real</Btn>
              <Btn size="sm" variant="danger" onClick={() => setAnswers({ ...answers, [i]: false })}>Fake</Btn>
            </div>
          ) : (
            <Badge tone={answers[i] === u.safe ? 'mint' : 'rose'}>{answers[i] === u.safe ? 'Correct' : `Wrong — it's ${u.safe ? 'real' : 'fake'}`}</Badge>
          )}
        </div>
      ))}
    </Card>
  )
}

export default function Safety() {
  const { addXP, set } = useStore()
  const [topic, setTopic] = useState(safetyTopics[0].slug)
  const t = safetyTopics.find((x) => x.slug === topic)!
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Digital Safety Centre" subtitle="Be smart, safe and kind online." icon={ShieldCheck} tone="sky" />
      <TabPanels
        tabs={[
          { id: 'topics', label: 'Topics' },
          { id: 'quiz', label: 'Safety quiz' },
        ]}
        panels={{
          topics: (
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              <div className="flex gap-2 overflow-x-auto lg:flex-col">
                {safetyTopics.map((s) => (
                  <button key={s.slug} type="button" onClick={() => setTopic(s.slug)} className={cn('flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold', topic === s.slug ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}>
                    <s.icon className="size-4" aria-hidden /> {s.name}
                  </button>
                ))}
              </div>
              <Card className="flex flex-col gap-4">
                <span className={cn('flex size-12 items-center justify-center rounded-2xl', toneSoft[t.tone])}>
                  <t.icon className="size-6" aria-hidden />
                </span>
                <h2 className="text-2xl font-semibold">{t.name}</h2>
                <p className="leading-relaxed text-muted-foreground">{t.blurb}</p>
                <ul className="flex flex-col gap-2">
                  {t.tips.map((tip) => (
                    <li key={tip} className="flex gap-2 rounded-2xl bg-muted/60 p-3 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-mint" aria-hidden /> {tip}
                    </li>
                  ))}
                </ul>
                <Btn className="w-fit" onClick={() => addXP(25, `Read: ${t.name}`)}>I&apos;ve read this · +25 XP</Btn>
              </Card>
            </div>
          ),
          quiz: (
            <Quiz
              title="Digital safety quiz"
              questions={assessments[0].questions}
              timed={90}
              onFinish={(pct) => {
                addXP(Math.round(pct), `Safety quiz: ${pct}%`)
                if (pct >= 80) set((s) => ({ earnedBadges: s.earnedBadges.includes('safety-scout') ? s.earnedBadges : [...s.earnedBadges, 'safety-scout'] }))
              }}
            />
          ),
        }}
      />
    </div>
  )
}
