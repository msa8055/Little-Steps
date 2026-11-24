'use client'

import { Brain, Gamepad2, Keyboard, RotateCcw, Shuffle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Btn, Card, CardTitle, Input, PageHeader, TabPanels } from '@/components/ls/ui'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const symbols = ['Sun', 'Moon', 'Star', 'Leaf', 'Fish', 'Bird']
function Memory() {
  const { addXP } = useStore()
  const deck = () => [...symbols, ...symbols].map((s, i) => ({ s, k: i })).sort(() => Math.random() - 0.5)
  const [cards, setCards] = useState(deck)
  const [flip, setFlip] = useState<number[]>([])
  const [found, setFound] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  useEffect(() => {
    if (flip.length !== 2) return
    const [a, b] = flip
    const t = setTimeout(() => {
      if (cards[a].s === cards[b].s) {
        const nf = [...found, cards[a].s]
        setFound(nf)
        if (nf.length === symbols.length) addXP(40, `Memory match in ${moves} moves`)
      }
      setFlip([])
    }, 700)
    return () => clearTimeout(t)
  }, [flip, cards, found, moves, addXP])
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Memory match" icon={Brain} sub={`Moves: ${moves} · Pairs: ${found.length}/${symbols.length}`} action={<Btn size="sm" variant="outline" onClick={() => { setCards(deck()); setFound([]); setFlip([]); setMoves(0) }}><RotateCcw /> Reset</Btn>} />
      <div className="grid grid-cols-4 gap-2 sm:max-w-md">
        {cards.map((c, i) => {
          const shown = flip.includes(i) || found.includes(c.s)
          return (
            <button key={c.k} type="button" aria-label={shown ? c.s : 'Hidden card'} disabled={shown || flip.length === 2} onClick={() => { setFlip([...flip, i]); setMoves(moves + (flip.length === 1 ? 1 : 0)) }} className={cn('flex aspect-square items-center justify-center rounded-2xl text-sm font-extrabold transition', shown ? (found.includes(c.s) ? 'bg-mint-soft' : 'bg-sun-soft') : 'bg-primary text-primary-foreground hover:opacity-90')}>
              {shown ? c.s : '?'}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

const words = ['kindness', 'budget', 'courage', 'planet', 'teamwork', 'curious', 'savings', 'respect']
function Scramble() {
  const { addXP } = useStore()
  const [i, setI] = useState(0)
  const [guess, setGuess] = useState('')
  const [msg, setMsg] = useState('')
  const word = words[i % words.length]
  const scrambled = useMemo(() => word.split('').sort(() => Math.random() - 0.5).join(''), [word])
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Word scramble" icon={Shuffle} tone="sun" />
      <p className="font-heading text-4xl font-semibold tracking-[0.3em] uppercase">{scrambled}</p>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (guess.trim().toLowerCase() === word) { setMsg('Correct!'); addXP(15, 'Word unscrambled'); setI(i + 1); setGuess('') } else setMsg('Not quite — try again.') }}>
        <Input aria-label="Your answer" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Your answer" />
        <Btn type="submit">Check</Btn>
      </form>
      <p aria-live="polite" className="text-sm font-bold">{msg}</p>
      <Btn variant="ghost" size="sm" className="w-fit" onClick={() => { setI(i + 1); setMsg(`It was "${word}"`) }}>Skip</Btn>
    </Card>
  )
}

const sentence = 'Little steps every day add up to big changes over time.'
function Typing() {
  const { addXP } = useStore()
  const [text, setText] = useState('')
  const [start, setStart] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Typing speed" icon={Keyboard} tone="sky" />
      <p className="rounded-2xl bg-muted p-4 font-mono text-lg">
        {sentence.split('').map((ch, i) => <span key={i} className={cn(i < text.length && (text[i] === ch ? 'text-mint' : 'bg-rose-soft text-destructive'))}>{ch}</span>)}
      </p>
      <Input aria-label="Type the sentence" value={text} disabled={wpm !== null} onChange={(e) => {
        const v = e.target.value
        if (!start) setStart(Date.now())
        setText(v)
        if (v === sentence && start) { const w = Math.round(sentence.split(' ').length / ((Date.now() - start) / 60000)); setWpm(w); addXP(20, `Typing: ${w} WPM`) }
      }} />
      {wpm !== null && <div className="flex items-center gap-3"><p className="font-heading text-3xl font-semibold">{wpm} WPM</p><Btn size="sm" variant="outline" onClick={() => { setText(''); setStart(null); setWpm(null) }}>Again</Btn></div>}
    </Card>
  )
}

function MathSprint() {
  const { addXP } = useStore()
  const gen = () => { const a = Math.ceil(Math.random() * 12), b = Math.ceil(Math.random() * 12); return { a, b } }
  const [p, setP] = useState(gen)
  const [ans, setAns] = useState('')
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(0)
  useEffect(() => { if (left <= 0) return; const t = setTimeout(() => { setLeft(left - 1); if (left === 1) addXP(score * 3, `Math sprint: ${score}`) }, 1000); return () => clearTimeout(t) }, [left, score, addXP])
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Times-table sprint" icon={Gamepad2} tone="mint" sub={left > 0 ? `${left}s · Score ${score}` : `Last score ${score}`} />
      {left > 0 ? (
        <form className="flex items-center gap-3" onSubmit={(e) => { e.preventDefault(); if (Number(ans) === p.a * p.b) setScore(score + 1); setP(gen()); setAns('') }}>
          <span className="font-heading text-3xl font-semibold">{p.a} × {p.b} =</span>
          <Input aria-label="Answer" type="number" autoFocus value={ans} onChange={(e) => setAns(e.target.value)} className="w-24" />
        </form>
      ) : (
        <Btn className="w-fit" onClick={() => { setScore(0); setLeft(30); setP(gen()) }}>Start 30s sprint</Btn>
      )}
    </Card>
  )
}

export default function Games() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Play" title="Games Arcade" subtitle="Brain-boosting mini games that earn XP." icon={Gamepad2} tone="mint" />
      <TabPanels tabs={[{ id: 'mem', label: 'Memory' }, { id: 'word', label: 'Words' }, { id: 'type', label: 'Typing' }, { id: 'math', label: 'Maths' }]} panels={{ mem: <Memory />, word: <Scramble />, type: <Typing />, math: <MathSprint /> }} />
    </div>
  )
}
