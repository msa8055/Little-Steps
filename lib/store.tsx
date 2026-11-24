'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Account } from './auth-db'
import type { Mentor } from './data'
import { toast } from 'sonner'

export type Role = 'child' | 'parent' | 'mentor' | 'admin'
export type Priority = 'low' | 'medium' | 'high'

export type Task = { id: string; title: string; priority: Priority; due: string; done: boolean; category: string; reminder?: boolean; assignedBy?: string }
export type JournalEntry = { id: string; title: string; body: string; mood: string; date: string; favourite: boolean }
export type Tx = { id: string; label: string; amount: number; type: 'income' | 'expense'; category: string; date: string }
export type SavingsGoal = { id: string; name: string; target: number; saved: number }
export type Notif = { id: string; title: string; body: string; type: string; date: string; read: boolean; href?: string }
export type Booking = { id: string; mentorId: string; date: string; time: string; topic: string; status: 'upcoming' | 'completed' | 'cancelled'; notes?: string; rating?: number }
export type Post = { id: string; author: string; body: string; likes: number; liked: boolean; reactions: Record<string, number>; comments: { author: string; body: string }[]; date: string; tag: string; image?: string; reported?: boolean }
export type HistoryItem = { id: string; kind: string; title: string; date: string; score?: number; href?: string }
export type Creation = { id: string; title: string; category: string; image: string; likes: number; favourite: boolean; description: string }

export type Settings = {
  dark: boolean
  contrast: boolean
  dyslexia: boolean
  fontSize: number
  language: string
  twoFactor: boolean
  profilePublic: boolean
  showAchievements: boolean
  allowMessages: boolean
  notifications: Record<string, boolean>
  reduceMotion: boolean
}

export type User = { name: string; email: string; age: number; grade: string; interests: string[]; bio: string; photo?: string; avatarColor: string; avatarFace: string; linkCode: string }

type WorkspaceEntry = { id: string; text: string }
type Workspace = {
  familyGoals: (WorkspaceEntry & { done: boolean })[]
  mentorResources: WorkspaceEntry[]
  mentorMessages: WorkspaceEntry[]
  mentor?: Mentor
  userStatus: Record<string, string>
  mentorStatus: Record<string, string>
  audit: (WorkspaceEntry & { date: string })[]
  support: { id: string; name: string; email: string; topic: string; message: string; resolved: boolean }[]
}

export type State = {
  workspace: Workspace
  role: Role
  onboarded: boolean
  user: User
  xp: number
  xpByDay: Record<string, number>
  coins: number
  streak: number
  lastActiveDay?: string
  streakShields: number
  lastDailyReward?: string
  lastSpin?: string
  completedLessons: string[]
  bookmarks: string[]
  favourites: string[]
  recentlyViewed: string[]
  tasks: Task[]
  habits: { id: string; name: string; days: boolean[] }[]
  journal: JournalEntry[]
  transactions: Tx[]
  savingsGoals: SavingsGoal[]
  budget: Record<string, number>
  moods: Record<string, string>
  water: Record<string, number>
  sleep: Record<string, number>
  exercise: Record<string, number>
  screenTime: Record<string, number>
  notifications: Notif[]
  bookings: Booking[]
  posts: Post[]
  history: HistoryItem[]
  creations: Creation[]
  owned: string[]
  equipped: { theme: string; frame: string }
  earnedBadges: string[]
  joinedChallenges: string[]
  dreamCareer?: string
  visionBoard: { id: string; text: string; color: string }[]
  settings: Settings
}

const today = () => new Date().toISOString().slice(0, 10)
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10)
export const uid = () => Math.random().toString(36).slice(2, 10)

export const initialState: State = {
  workspace: { familyGoals: [], mentorResources: [], mentorMessages: [], userStatus: {}, mentorStatus: {}, audit: [], support: [] },
  role: 'child',
  onboarded: true,
  user: { name: '', email: '', age: 0, grade: '', interests: [], bio: '', avatarColor: 'bg-primary', avatarFace: '', linkCode: '' },
  xp: 0,
  xpByDay: {},
  coins: 0,
  streak: 0,
  streakShields: 0,
  completedLessons: [],
  bookmarks: [],
  favourites: [],
  recentlyViewed: [],
  tasks: [],
  habits: [],
  journal: [],
  transactions: [],
  savingsGoals: [],
  budget: {},
  moods: {},
  water: {},
  sleep: {},
  exercise: {},
  screenTime: {},
  notifications: [],
  bookings: [],
  posts: [],
  history: [],
  creations: [],
  owned: [],
  equipped: { theme: 'theme-lavender', frame: 'frame-basic' },
  earnedBadges: [],
  joinedChallenges: [],
  visionBoard: [],
  settings: {
    dark: false,
    contrast: false,
    dyslexia: false,
    fontSize: 16,
    language: 'English',
    twoFactor: false,
    profilePublic: false,
    showAchievements: true,
    allowMessages: true,
    reduceMotion: false,
    notifications: { learning: true, achievement: true, challenge: true, mentor: true, session: true, parent: true, system: true, email: false },
  },
}

type Ctx = {
  state: State
  hydrated: boolean
  set: (fn: (s: State) => Partial<State>) => void
  addXP: (xp: number, reason?: string, coins?: number) => void
  spendCoins: (amount: number, label: string) => boolean
  logHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void
  notify: (n: Omit<Notif, 'id' | 'date' | 'read'>) => void
  reset: () => void
  level: number
  levelProgress: number
}

const StoreContext = createContext<Ctx | null>(null)
export function StoreProvider({ children, account }: { children: React.ReactNode; account: Account | null }) {
  const storageKey = 'littlesteps-account-v1:' + (account?.id ?? 'guest')
  const baseline = useMemo<State>(() => account ? {
    ...initialState, role: account.role, user: { ...initialState.user, name: account.name, email: account.email },
  } : initialState, [account])
  const [state, setState] = useState<State>(baseline)
  const [hydrated, setHydrated] = useState(false)
  const completedTaskCount = state.tasks.filter(task => task.done).length
  const lessonCount = state.completedLessons.length
  const xp = state.xp
  const accountId = account?.id
  const role = account?.role

  useEffect(() => {
    if (!hydrated || role !== 'child' || !accountId) return
    void fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp, lessons: lessonCount, tasks: completedTaskCount }),
      keepalive: true,
    }).catch(() => {})
  }, [accountId, role, hydrated, xp, lessonCount, completedTaskCount])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.lastActiveDay && parsed.lastActiveDay < daysAgo(1)) parsed.streak = 0
        setState({
          ...baseline, ...parsed, role: baseline.role,
          user: { ...baseline.user, ...parsed.user, email: baseline.user.email },
          workspace: { ...baseline.workspace, ...parsed.workspace },
          settings: { ...baseline.settings, ...parsed.settings },
        })
      }
    } catch {}
    setHydrated(true)
  }, [storageKey, baseline])

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(storageKey, JSON.stringify(state)) } catch {}
    }
  }, [storageKey, state, hydrated])

  useEffect(() => {
    const el = document.documentElement
    el.classList.toggle('dark', state.settings.dark)
    el.classList.toggle('hc', state.settings.contrast)
    el.classList.toggle('dyslexic', state.settings.dyslexia)
    el.style.setProperty('--base-size', `${state.settings.fontSize}px`)
  }, [state.settings])

  const set = useCallback((fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) })), [])

  const addXP = useCallback(
    (xp: number, reason?: string, coins = Math.round(xp / 5)) => {
      const day = today()
      const yesterday = daysAgo(1)
      setState((s) => ({
        ...s,
        xp: s.xp + xp,
        coins: s.coins + coins,
        xpByDay: { ...s.xpByDay, [day]: (s.xpByDay[day] ?? 0) + xp },
        lastActiveDay: xp > 0 ? day : s.lastActiveDay,
        streak: xp <= 0 || s.lastActiveDay === day ? s.streak : s.lastActiveDay === yesterday ? s.streak + 1 : 1,
      }))
      toast.success(`+${xp} XP${coins ? ` · +${coins} coins` : ''}`, { description: reason })
    },
    [],
  )

  const spendCoins = useCallback(
    (amount: number, label: string) => {
      if (state.coins < amount) {
        toast.error('Not enough LittleSteps Coins', { description: `You need ${amount - state.coins} more coins.` })
        return false
      }
      setState((s) => ({ ...s, coins: s.coins - amount }))
      toast.success(`Redeemed: ${label}`, { description: `-${amount} coins` })
      return true
    },
    [state.coins],
  )

  const logHistory = useCallback((item: Omit<HistoryItem, 'id' | 'date'>) => {
    setState((s) => ({ ...s, history: [{ ...item, id: uid(), date: today() }, ...s.history].slice(0, 60) }))
  }, [])

  const notify = useCallback((n: Omit<Notif, 'id' | 'date' | 'read'>) => {
    setState((s) => ({ ...s, notifications: [{ ...n, id: uid(), date: today(), read: false }, ...s.notifications] }))
  }, [])

  const reset = useCallback(() => {
    try { localStorage.removeItem(storageKey) } catch {}
    setState(baseline)
    toast.success('Local workspace cleared')
  }, [baseline, storageKey])

  const level = Math.floor(state.xp / 500) + 1
  const levelProgress = ((state.xp % 500) / 500) * 100

  const value = useMemo(
    () => ({ state, hydrated, set, addXP, spendCoins, logHistory, notify, reset, level, levelProgress }),
    [state, hydrated, set, addXP, spendCoins, logHistory, notify, reset, level, levelProgress],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { today, daysAgo, inDays }

