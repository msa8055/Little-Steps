'use client'

import { motion } from 'framer-motion'
import { Award, Coins, Flame, Gift, Lock, Shield, Sparkles, Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge, Btn, Card, CardTitle, Chip, PageHeader, Progress, Stat, TabPanels, toneSoft } from '@/components/ls/ui'
import { badges, storeItems } from '@/lib/data'
import { today, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const prizes = [{ l: '10 coins', c: 10 }, { l: '25 XP', x: 25 }, { l: '50 coins', c: 50 }, { l: 'Shield', s: 1 }, { l: '5 coins', c: 5 }, { l: '100 XP', x: 100 }, { l: '20 coins', c: 20 }, { l: '40 XP', x: 40 }]

function Spin() {
  const { state, set, addXP } = useStore()
  const [rot, setRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const used = state.lastSpin === today()
  const spin = () => {
    const idx = Math.floor(Math.random() * prizes.length)
    const target = rot + 360 * 5 + (360 - idx * 45 - 22.5) - (rot % 360)
    setRot(target)
    setSpinning(true)
    setTimeout(() => {
      setSpinning(false)
      const p = prizes[idx]
      set((s) => ({ lastSpin: today(), coins: s.coins + (p.c ?? 0), streakShields: s.streakShields + (p.s ?? 0) }))
      if (p.x) addXP(p.x, 'Spin the wheel', 0)
      else toast.success(`You won ${p.l}!`)
    }, 3200)
  }
  return (
    <Card className="flex flex-col items-center gap-5">
      <CardTitle title="Spin the wheel" icon={Sparkles} tone="sun" sub="One free spin every day" />
      <div className="relative">
        <div className="absolute -top-2 left-1/2 z-10 size-0 -translate-x-1/2 border-x-[10px] border-t-[18px] border-x-transparent border-t-foreground" aria-hidden />
        <motion.div animate={{ rotate: rot }} transition={{ duration: 3, ease: [0.2, 0.8, 0.3, 1] }} className="relative size-64 rounded-full border-8 border-card shadow-lg" style={{ background: `conic-gradient(${prizes.map((_, i) => `${['var(--primary)', 'var(--sun)', 'var(--mint)', 'var(--sky)'][i % 4]} ${i * 45}deg ${(i + 1) * 45}deg`).join(',')})` }}>
          {prizes.map((p, i) => (
            <span key={i} className="absolute top-1/2 left-1/2 origin-left text-xs font-extrabold text-primary-foreground" style={{ transform: `rotate(${i * 45 + 22.5 - 90}deg) translateX(40px)` }}>{p.l}</span>
          ))}
        </motion.div>
      </div>
      <Btn disabled={used || spinning} onClick={spin}>{used ? 'Come back tomorrow' : spinning ? 'Spinning…' : 'Spin!'}</Btn>
    </Card>
  )
}

function Daily() {
  const { state, set, addXP } = useStore()
  const claimed = state.lastDailyReward === today()
  return (
    <Card className="flex flex-col gap-4">
      <CardTitle title="Daily login reward" icon={Gift} tone="mint" sub={`${state.streak}-day streak`} />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = (state.streak % 7) + (claimed ? 0 : 1)
          return (
            <div key={i} className={cn('flex flex-col items-center gap-1 rounded-2xl p-2 text-xs font-bold', i + 1 < day || (claimed && i + 1 === day) ? 'bg-mint-soft' : i + 1 === day ? 'bg-sun-soft ring-2 ring-sun' : 'bg-muted')}>
              <Coins className="size-4" aria-hidden />
              {(i + 1) * 10}
            </div>
          )
        })}
      </div>
      <Btn disabled={claimed} onClick={() => { set(() => ({ lastDailyReward: today() })); addXP(20, 'Daily reward', ((state.streak % 7) + 1) * 10) }}>{claimed ? 'Claimed today' : 'Claim reward'}</Btn>
      <div className="flex items-center gap-3 rounded-2xl bg-sky-soft p-3 text-sm">
        <Shield className="size-5 text-sky" aria-hidden />
        <span className="flex-1"><strong>{state.streakShields}</strong> streak shields protect your streak if you miss a day.</span>
      </div>
    </Card>
  )
}

function Store() {
  const { state, set, spendCoins } = useStore()
  const [kind, setKind] = useState('All')
  const kinds = ['All', ...Array.from(new Set(storeItems.map((i) => i.kind)))]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">{kinds.map((k) => <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{k}</Chip>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {storeItems.filter((i) => kind === 'All' || i.kind === kind).map((it) => {
          const owned = state.owned.includes(it.id) || it.price === 0
          const equipped = state.equipped.theme === it.id || state.equipped.frame === it.id
          const canEquip = it.kind === 'Theme' || it.kind === 'Frame'
          return (
            <Card key={it.id} className="flex flex-col gap-3">
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-secondary"><Star className="size-10 text-primary" aria-hidden /></div>
              <div className="flex items-start justify-between gap-2"><h3 className="font-semibold">{it.name}</h3><Badge tone="muted">{it.kind}</Badge></div>
              {owned ? (
                canEquip ? (
                  <Btn size="sm" variant={equipped ? 'secondary' : 'outline'} onClick={() => set((s) => ({ equipped: { ...s.equipped, [it.kind === 'Theme' ? 'theme' : 'frame']: it.id } }))}>{equipped ? 'Equipped' : 'Equip'}</Btn>
                ) : (
                  <Badge tone="mint">Owned</Badge>
                )
              ) : (
                <Btn size="sm" onClick={() => { if (spendCoins(it.price, it.name)) set((s) => ({ owned: [...s.owned, it.id], streakShields: it.id === 'reward-shield' ? s.streakShields + 1 : s.streakShields })) }}><Coins /> {it.price}</Btn>
              )}
            </Card>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">* Real rewards are sent to your parent for approval.</p>
    </div>
  )
}

function Badges() {
  const { state } = useStore()
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {badges.map((b) => {
        const has = state.earnedBadges.includes(b.id)
        return (
          <Card key={b.id} className={cn('flex flex-col items-center gap-2 text-center', !has && 'opacity-60')}>
            <span className={cn('flex size-16 items-center justify-center rounded-full', has ? toneSoft[b.tone] : 'bg-muted')}>{has ? <Award className="size-8" aria-hidden /> : <Lock className="size-6 text-muted-foreground" aria-hidden />}</span>
            <p className="font-bold">{b.name}</p>
            <p className="text-xs text-muted-foreground">{b.desc}</p>
          </Card>
        )
      })}
    </div>
  )
}

function Leaders() {
  return <Card><p>Rankings require a shared leaderboard.</p></Card>
}

export default function Rewards() {
  const { state, level, levelProgress } = useStore()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Play" title="Rewards" subtitle="Earn XP and coins, unlock badges and treats." icon={Gift} tone="sun" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Level" value={level} icon={Star} hint={`${Math.round(levelProgress)}% to next`} />
        <Stat label="Coins" value={state.coins} icon={Coins} tone="sun" />
        <Stat label="Badges" value={`${state.earnedBadges.length}/${badges.length}`} icon={Award} tone="mint" />
      </div>
      <Progress value={levelProgress} label="Level progress" />
      <TabPanels
        tabs={[{ id: 'daily', label: 'Daily' }, { id: 'store', label: 'Store' }, { id: 'badges', label: 'Badges' }, { id: 'board', label: 'Leaderboard' }]}
        panels={{ daily: <div className="grid gap-4 lg:grid-cols-2"><Daily /><Spin /></div>, store: <Store />, badges: <Badges />, board: <Leaders /> }}
      />
    </div>
  )
}
