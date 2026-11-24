'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { Btn, Card, Chip, Field, Input, Progress, Select } from '@/components/ls/ui'
import { roleMeta } from '@/lib/nav'
import { uid, useStore } from '@/lib/store'
import { clearSavedEmails, login, register } from '@/lib/auth-actions'
import { maximumPasswordLength, minimumPasswordLength } from '@/lib/auth-rules'

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-balance">{title}</h1>
      <p className="mt-1 text-muted-foreground">{sub}</p>
    </div>
  )
}

const errors = {
  invalid: 'Check the details you entered and try again.',
  unavailable: 'Could not create an account for that email. Try signing in.',
  rate: 'Too many attempts. Try again in a few minutes.',
}

function AuthError({ error }: { error?: string }) {
  const message = error && Object.hasOwn(errors, error) ? errors[error as keyof typeof errors] : undefined
  return message && <p role="alert" className="text-sm font-bold text-destructive">{message}</p>
}

function PasswordField({ label, name = 'password', registration = false, showStrength = false }: {
  label: string
  name?: string
  registration?: boolean
  showStrength?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const [password, setPassword] = useState('')
  const variety = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((pattern) => pattern.test(password)).length
  const strength = password.length >= 14 && variety >= 3 ? 'Strong' : password.length >= 10 && variety >= 2 ? 'Fair' : 'Weak'
  return <Field label={label} hint={showStrength ? 'Use at least six characters.' : undefined}>
    {(id) => <>
      <div className="relative">
        <Input id={id} name={name} type={visible ? 'text' : 'password'} required
          minLength={registration ? minimumPasswordLength : undefined} maxLength={maximumPasswordLength}
          autoComplete={registration ? 'new-password' : 'current-password'} className="pr-12"
          onChange={showStrength ? (event) => setPassword(event.target.value) : undefined} />
        <button type="button" onClick={() => setVisible((value) => !value)}
          aria-label={(visible ? 'Hide ' : 'Show ') + label.toLowerCase()}
          aria-controls={id} className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-muted-foreground hover:text-foreground">
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </div>
      {showStrength && <div className="pt-2" aria-live="polite">
        {password && <>
          <Progress value={strength === 'Strong' ? 100 : strength === 'Fair' ? 66 : 33}
            tone={strength === 'Strong' ? 'mint' : strength === 'Fair' ? 'sun' : 'rose'} label="Password strength estimate" />
          <p className="mt-1 text-xs text-muted-foreground">Password strength: {strength}</p>
        </>}
      </div>}
    </>}
  </Field>
}

function RememberEmail() {
  return <label className="flex items-start gap-2 text-sm">
    <input type="checkbox" name="rememberEmail" className="mt-0.5 size-4 accent-primary" />
    Remember this email on this browser
  </label>
}

export function LoginForm({ error, saved }: { error?: string; saved: string[] }) {
  const [email, setEmail] = useState('')
  return <>
    <Heading title="Sign in" sub="Use the email and password you registered with." />
    {saved.length > 0 && <div className="mb-4 space-y-2">
      <p className="text-sm font-bold">Saved emails</p>
      <div className="flex flex-wrap gap-2">
        {saved.map((savedEmail) => <Chip key={savedEmail} active={email === savedEmail} onClick={() => setEmail(savedEmail)}>{savedEmail}</Chip>)}
      </div>
      <form action={clearSavedEmails}>
        <button type="submit" className="text-xs font-bold text-primary underline">Clear saved emails</button>
      </form>
    </div>}
    <form action={login} className="flex flex-col gap-4">
      <AuthError error={error} />
      <Field label="Email">{(id) => <Input id={id} name="email" required type="email" maxLength={254} autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />}</Field>
      <PasswordField label="Password" />
      <RememberEmail />
      <Btn type="submit" size="lg">Sign in <ArrowRight /></Btn>
      <Link href="/register" className="text-center text-sm font-bold text-primary">Create an account</Link>
    </form>
  </>
}

export function RegisterForm({ error }: { error?: string }) {
  return <>
    <Heading title="Create your account" sub="Choose a role and set a password for your LittleSteps account." />
    <form action={register} className="flex flex-col gap-4">
      <AuthError error={error} />
      <Field label="Display name">{(id) => <Input id={id} name="name" required minLength={2} maxLength={80} autoComplete="name" />}</Field>
      <Field label="Email">{(id) => <Input id={id} name="email" required type="email" maxLength={254} autoComplete="username" />}</Field>
      <PasswordField label="Password" registration showStrength />
      <PasswordField label="Confirm password" name="confirmPassword" registration />
      <Field label="Account role">{(id) => <Select id={id} name="role"><option value="child">Learner</option><option value="parent">Parent</option><option value="mentor">Mentor</option></Select>}</Field>
      <RememberEmail />
      <Btn type="submit" size="lg">Create account <ArrowRight /></Btn>
      <Link href="/login" className="text-center text-sm font-bold text-primary">Already have an account? Sign in</Link>
    </form>
  </>
}

export function Onboarding() {
  const { hydrated } = useStore()
  return hydrated ? <OnboardingForm /> : null
}

const interestOpts = ['Coding', 'Art', 'Music', 'Sports', 'Space', 'Reading', 'Science', 'Animals', 'Gaming', 'Nature', 'Business', 'Writing']
const goalOpts = ['Speak confidently', 'Manage my money', 'Stay safe online', 'Find my dream career', 'Feel calmer', 'Be more organised']
function OnboardingForm() {
  const router = useRouter()
  const { set, state } = useStore()
  const [step, setStep] = useState(0)
  const [interests, setInterests] = useState<string[]>(state.user.interests)
  const [goals, setGoals] = useState<string[]>([])
  const [grade, setGrade] = useState(state.user.grade)
  const toggle = (arr: string[], v: string, fn: (a: string[]) => void) => fn(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  const steps = [
    <div key="0" className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">What are you into?</h2>
      <div className="flex flex-wrap gap-2">{interestOpts.map((i) => <Chip key={i} active={interests.includes(i)} onClick={() => toggle(interests, i, setInterests)}>{i}</Chip>)}</div>
    </div>,
    <div key="1" className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">What would you like to get better at?</h2>
      <div className="flex flex-wrap gap-2">{goalOpts.map((i) => <Chip key={i} active={goals.includes(i)} onClick={() => toggle(goals, i, setGoals)}>{i}</Chip>)}</div>
    </div>,
    <div key="2" className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Which grade are you in?</h2>
      <Field label="Grade">{(id) => <Select id={id} value={grade} onChange={(e) => setGrade(e.target.value)}><option value="">Choose your grade</option>{Array.from({ length: 8 }, (_, i) => `Grade ${i + 5}`).map((g) => <option key={g}>{g}</option>)}</Select>}</Field>
    </div>,
  ]
  return (
    <>
      <Heading title="Let's set up your journey" sub={`Step ${step + 1} of ${steps.length}`} />
      <Progress value={((step + 1) / steps.length) * 100} className="mb-6" />
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>{steps[step]}</motion.div>
      <div className="mt-8 flex justify-between">
        <Btn variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Btn>
        <Btn
          onClick={() => {
            if (step < steps.length - 1) return setStep(step + 1)
            set((s) => ({ onboarded: true, user: { ...s.user, interests, grade }, visionBoard: [...s.visionBoard, ...goals.filter((goal) => !s.visionBoard.some((item) => item.text === goal)).map((text) => ({ id: uid(), text, color: 'bg-secondary' }))] }))
            router.push('/welcome')
          }}
        >
          {step < steps.length - 1 ? 'Next' : 'Finish'} <ArrowRight />
        </Btn>
      </div>
    </>
  )
}

export function Welcome() {
  const { state } = useStore()
  return (
    <Card className="flex flex-col items-center gap-4 p-8 text-center">
      <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }} className="flex size-20 items-center justify-center rounded-3xl bg-sun">
        <PartyPopper className="size-10" aria-hidden />
      </motion.span>
      <h1 className="text-3xl font-semibold text-balance">Welcome, {state.user.name.split(' ')[0] || 'learner'}!</h1>
      <p className="leading-relaxed text-muted-foreground">Your profile is ready. Complete a lesson or add a task to start tracking your progress.</p>
      <Btn href={roleMeta[state.role].home} size="lg">
        Go to my dashboard <ArrowRight />
      </Btn>
    </Card>
  )
}
