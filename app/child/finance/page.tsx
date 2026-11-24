'use client'

import { Calculator, PiggyBank, Plus, Target, Trash2, TrendingDown, TrendingUp, Wallet, LineChart as LineIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Quiz } from '@/components/ls/quiz'
import { Badge, Btn, Card, CardTitle, Field, Grid, Input, Modal, PageHeader, Progress, Select, Stat, TabPanels } from '@/components/ls/ui'
import { assessments } from '@/lib/data'
import { today, uid, useStore } from '@/lib/store'

const cats = ['Pocket money', 'Gift', 'Snacks', 'Stationery', 'Games', 'Transport', 'Savings', 'Other']
const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

function Tracker() {
  const { state, set } = useStore()
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ label: '', amount: '', type: 'expense' as 'income' | 'expense', category: 'Snacks' })
  const [err, setErr] = useState('')
  const income = state.transactions.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const expense = state.transactions.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const byCat = Object.entries(state.transactions.filter((t) => t.type === 'expense').reduce<Record<string, number>>((a, t) => ({ ...a, [t.category]: (a[t.category] ?? 0) + t.amount }), {})).map(([name, value]) => ({ name, value }))
  return (
    <div className="flex flex-col gap-4">
      <Grid cols={3}>
        <Stat label="Money in" value={inr(income)} icon={TrendingUp} tone="mint" />
        <Stat label="Money out" value={inr(expense)} icon={TrendingDown} tone="rose" />
        <Stat label="Balance" value={inr(income - expense)} icon={Wallet} tone="primary" />
      </Grid>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle title="Transactions" icon={Wallet} action={<Btn size="sm" onClick={() => setOpen(true)}><Plus /> Add</Btn>} />
          <ul className="flex flex-col divide-y divide-border">
            {state.transactions.slice(0, 10).map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                <div className="flex-1">
                  <p className="font-bold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.category} · {t.date}</p>
                </div>
                <span className={t.type === 'income' ? 'font-extrabold text-mint' : 'font-extrabold text-destructive'}>
                  {t.type === 'income' ? '+' : '-'}
                  {inr(t.amount)}
                </span>
                <button type="button" aria-label={`Delete ${t.label}`} onClick={() => set((s) => ({ transactions: s.transactions.filter((x) => x.id !== t.id) }))} className="rounded-lg p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle title="Where it goes" tone="sun" />
          <div className="h-52">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCat} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {byCat.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => inr(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-wrap gap-2 text-xs">
            {byCat.map((c, i) => (
              <li key={c.name} className="flex items-center gap-1"><span className="size-2.5 rounded-full" style={{ background: colors[i % colors.length] }} />{c.name}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add transaction"
        footer={
          <Btn
            onClick={() => {
              const amt = Number(f.amount)
              if (!f.label.trim() || !(amt > 0)) return setErr('Enter a label and an amount greater than 0.')
              set((s) => ({ transactions: [{ id: uid(), label: f.label, amount: amt, type: f.type, category: f.category, date: today() }, ...s.transactions] }))
              setOpen(false)
              setErr('')
              setF({ ...f, label: '', amount: '' })
            }}
          >
            Save
          </Btn>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {(['expense', 'income'] as const).map((t) => (
              <Btn key={t} variant={f.type === t ? 'primary' : 'outline'} onClick={() => setF({ ...f, type: t })}>{t === 'income' ? 'Money in' : 'Money out'}</Btn>
            ))}
          </div>
          <Field label="What for?" error={err}>{(id) => <Input id={id} value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} />}</Field>
          <Field label="Amount (₹)">{(id) => <Input id={id} type="number" min={1} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />}</Field>
          <Field label="Category">{(id) => <Select id={id} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{cats.map((c) => <option key={c}>{c}</option>)}</Select>}</Field>
        </div>
      </Modal>
    </div>
  )
}

function Goals() {
  const { state, set, addXP } = useStore()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-end gap-3">
        <div className="min-w-40 flex-1"><Field label="Goal name">{(id) => <Input id={id} value={name} onChange={(e) => setName(e.target.value)} placeholder="New bicycle" />}</Field></div>
        <div className="w-36"><Field label="Target (₹)">{(id) => <Input id={id} type="number" value={target} onChange={(e) => setTarget(e.target.value)} />}</Field></div>
        <Btn disabled={!name || !(Number(target) > 0)} onClick={() => { set((s) => ({ savingsGoals: [...s.savingsGoals, { id: uid(), name, target: Number(target), saved: 0 }] })); setName(''); setTarget('') }}><Plus /> Add goal</Btn>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {state.savingsGoals.map((g) => {
          const pct = Math.min(100, (g.saved / g.target) * 100)
          return (
            <Card key={g.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{g.name}</h3>
                {pct >= 100 ? <Badge tone="mint">Reached!</Badge> : <Badge tone="muted">{Math.round(pct)}%</Badge>}
              </div>
              <Progress value={pct} tone="mint" label={`${g.name} progress`} />
              <p className="text-sm text-muted-foreground">{inr(g.saved)} of {inr(g.target)}</p>
              <div className="flex flex-wrap gap-2">
                {[50, 100, 250].map((a) => (
                  <Btn key={a} size="sm" variant="secondary" onClick={() => { set((s) => ({ savingsGoals: s.savingsGoals.map((x) => (x.id === g.id ? { ...x, saved: x.saved + a } : x)) })); if (g.saved + a >= g.target && g.saved < g.target) addXP(100, `Goal reached: ${g.name}`) }}>+{inr(a)}</Btn>
                ))}
                <Btn size="sm" variant="ghost" onClick={() => set((s) => ({ savingsGoals: s.savingsGoals.filter((x) => x.id !== g.id) }))}><Trash2 /> Remove</Btn>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Budget() {
  const { state, set } = useStore()
  const total = Object.values(state.budget).reduce((a, b) => a + b, 0)
  const month = today().slice(0, 7)
  const income = state.transactions.filter((item) => item.type === 'income' && item.date.startsWith(month)).reduce((sum, item) => sum + item.amount, 0)
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Monthly budget planner" icon={Target} sub={`${inr(income)} income recorded this month`} />
      {['Food', 'Fun', 'Education', 'Savings', 'Gifts'].map((k) => (
        <div key={k} className="flex flex-col gap-1">
          <div className="flex justify-between text-sm font-bold"><label htmlFor={`b-${k}`}>{k}</label><span>{inr(state.budget[k] ?? 0)}</span></div>
          <input id={`b-${k}`} type="number" min={0} step={1} value={state.budget[k] ?? 0} onChange={(e) => set((s) => ({ budget: { ...s.budget, [k]: Math.max(0, Number(e.target.value)) } }))} className="accent-primary" />
        </div>
      ))}
      <div className={total > income ? 'rounded-2xl bg-rose-soft p-3 font-bold' : 'rounded-2xl bg-mint-soft p-3 font-bold'}>
        {total > income ? `Over budget by ${inr(total - income)} — try reducing wants.` : `${inr(income - total)} left unplanned. Nice!`}
      </div>
    </Card>
  )
}

const items = [
  { n: 'School shoes', need: true }, { n: 'Video game skin', need: false }, { n: 'Lunch', need: true }, { n: 'Movie ticket', need: false },
  { n: 'Notebook', need: true }, { n: 'Fancy headphones', need: false },
]
function NeedsWants() {
  const [ans, setAns] = useState<Record<string, boolean>>({})
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle title="Needs vs wants" tone="sun" sub="Sort each item" />
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.n} className="flex items-center justify-between gap-2 rounded-2xl bg-muted/60 p-3">
            <span className="font-bold">{it.n}</span>
            {ans[it.n] === undefined ? (
              <div className="flex gap-1">
                <Btn size="sm" variant="mint" onClick={() => setAns({ ...ans, [it.n]: true })}>Need</Btn>
                <Btn size="sm" variant="sun" onClick={() => setAns({ ...ans, [it.n]: false })}>Want</Btn>
              </div>
            ) : (
              <Badge tone={ans[it.n] === it.need ? 'mint' : 'rose'}>{ans[it.n] === it.need ? 'Correct' : `It's a ${it.need ? 'need' : 'want'}`}</Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

function InterestCalc() {
  const [p, setP] = useState(1000)
  const [r, setR] = useState(6)
  const [y, setY] = useState(5)
  const data = useMemo(() => Array.from({ length: y + 1 }, (_, i) => ({ year: `Y${i}`, value: Math.round(p * Math.pow(1 + r / 100, i)) })), [p, r, y])
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Compound interest calculator" icon={Calculator} tone="sky" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Start (₹)">{(id) => <Input id={id} type="number" value={p} onChange={(e) => setP(Math.max(0, Number(e.target.value)))} />}</Field>
        <Field label="Rate (%)">{(id) => <Input id={id} type="number" value={r} onChange={(e) => setR(Math.max(0, Number(e.target.value)))} />}</Field>
        <Field label="Years">{(id) => <Input id={id} type="number" value={y} onChange={(e) => setY(Math.min(30, Math.max(1, Number(e.target.value))))} />}</Field>
      </div>
      <p className="font-heading text-2xl font-semibold">{inr(data[data.length - 1].value)} <span className="text-sm font-normal text-muted-foreground">after {y} years</span></p>
      <div className="h-48">
        <ResponsiveContainer>
          <LineChart data={data}><XAxis dataKey="year" fontSize={12} /><YAxis fontSize={12} width={50} /><Tooltip formatter={(v) => inr(Number(v))} /><Line dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

const stocks = [{ s: 'CHOCO', n: 'ChocoFactory' }, { s: 'ROBO', n: 'RoboToys' }, { s: 'GREEN', n: 'GreenEnergy' }]
function StockGame() {
  const [cash, setCash] = useState(1000)
  const [day, setDay] = useState(1)
  const [prices, setPrices] = useState<Record<string, number>>({ CHOCO: 50, ROBO: 120, GREEN: 80 })
  const [held, setHeld] = useState<Record<string, number>>({ CHOCO: 0, ROBO: 0, GREEN: 0 })
  const worth = cash + stocks.reduce((a, x) => a + held[x.s] * prices[x.s], 0)
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Mini stock market game" icon={LineIcon} tone="mint" sub={`Day ${day} · Practice money only`} action={<Btn size="sm" onClick={() => { setDay(day + 1); setPrices(Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, Math.max(5, Math.round(v * (0.85 + Math.random() * 0.32)))]))) }}>Next day</Btn>} />
      <div className="flex gap-6 font-bold"><span>Cash {inr(cash)}</span><span>Net worth <span className={worth >= 1000 ? 'text-mint' : 'text-destructive'}>{inr(worth)}</span></span></div>
      {stocks.map((x) => (
        <div key={x.s} className="flex flex-wrap items-center gap-3 rounded-2xl bg-muted/60 p-3">
          <div className="flex-1"><p className="font-bold">{x.n}</p><p className="text-xs text-muted-foreground">{x.s} · own {held[x.s]}</p></div>
          <span className="font-extrabold">{inr(prices[x.s])}</span>
          <Btn size="sm" variant="mint" disabled={cash < prices[x.s]} onClick={() => { setCash(cash - prices[x.s]); setHeld({ ...held, [x.s]: held[x.s] + 1 }) }}>Buy</Btn>
          <Btn size="sm" variant="outline" disabled={!held[x.s]} onClick={() => { setCash(cash + prices[x.s]); setHeld({ ...held, [x.s]: held[x.s] - 1 }) }}>Sell</Btn>
        </div>
      ))}
    </Card>
  )
}

export default function Finance() {
  const { addXP } = useStore()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Learn" title="Money Centre" subtitle="Track, save, plan and grow your money." icon={PiggyBank} tone="mint" />
      <TabPanels
        tabs={[{ id: 'track', label: 'Tracker' }, { id: 'goals', label: 'Savings goals' }, { id: 'budget', label: 'Budget' }, { id: 'learn', label: 'Games & tools' }, { id: 'quiz', label: 'Quiz' }]}
        panels={{
          track: <Tracker />,
          goals: <Goals />,
          budget: <div className="grid gap-4 lg:grid-cols-2"><Budget /><NeedsWants /></div>,
          learn: <div className="grid gap-4 lg:grid-cols-2"><InterestCalc /><StockGame /></div>,
          quiz: <Quiz title="Money smarts quiz" questions={assessments[1].questions} onFinish={(pct) => addXP(Math.round(pct), `Money quiz: ${pct}%`)} />,
        }}
      />
    </div>
  )
}
