'use client'

import { Flag, Heart, MessageCircle, Send, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Avatar, Badge, Btn, Card, Chip, Input, PageHeader, Select, Textarea } from '@/components/ls/ui'
import { today, uid, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const tags = ['Achievement', 'Question', 'Creative', 'Tip', 'Kindness']
const reacts = ['Clap', 'Wow', 'Love', 'Fire']
const blocked = /(stupid|idiot|hate|ugly|loser|address|phone number)/i

export default function Community() {
  const { state, set, addXP } = useStore()
  const [body, setBody] = useState('')
  const [tag, setTag] = useState(tags[0])
  const [filter, setFilter] = useState('All')
  const [comment, setComment] = useState<Record<string, string>>({})
  const [openC, setOpenC] = useState<string | null>(null)
  const post = () => {
    if (blocked.test(body)) return toast.error('Kindness check', { description: 'Your post may contain unkind words or personal info. Please edit it.' })
    set((s) => ({ posts: [{ id: uid(), author: s.user.name || 'Learner', body, likes: 0, liked: false, reactions: {}, comments: [], date: today(), tag }, ...s.posts] }))
    addXP(15, 'Shared with the community')
    setBody('')
  }
  const list = state.posts.filter((p) => !p.reported && (filter === 'All' || p.tag === filter))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Play" title="Community" subtitle="A safe, moderated space to share and cheer each other on." icon={Users} tone="sky" />
      <div className="flex items-center gap-3 rounded-2xl bg-mint-soft p-3 text-sm">
        <ShieldCheck className="size-5 shrink-0 text-mint" aria-hidden /> Every post is checked for kindness. Never share your address, school or phone number.
      </div>
      <Card className="flex flex-col gap-3">
        <Textarea aria-label="Write a post" rows={3} maxLength={400} placeholder="Share an achievement, a tip or a question…" value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="flex flex-wrap items-center gap-2">
          <Select aria-label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} className="w-40">{tags.map((t) => <option key={t}>{t}</option>)}</Select>
          <span className="text-xs text-muted-foreground">{body.length}/400</span>
          <Btn className="ml-auto" disabled={body.trim().length < 3} onClick={post}><Send /> Post</Btn>
        </div>
      </Card>
      <div className="flex flex-wrap gap-2">{['All', ...tags].map((t) => <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>{t}</Chip>)}</div>
      <ul className="flex flex-col gap-4">
        {list.map((p) => (
          <li key={p.id}>
            <Card className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={p.author} />
                <div className="flex-1"><p className="font-bold">{p.author}</p><p className="text-xs text-muted-foreground">{p.date}</p></div>
                <Badge tone="sky">{p.tag}</Badge>
              </div>
              <p className="leading-relaxed">{p.body}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Btn size="sm" variant={p.liked ? 'secondary' : 'ghost'} aria-pressed={p.liked} onClick={() => set((s) => ({ posts: s.posts.map((x) => (x.id === p.id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x)) }))}>
                  <Heart className={cn(p.liked && 'fill-destructive text-destructive')} /> {p.likes}
                </Btn>
                {reacts.map((r) => (
                  <button key={r} type="button" onClick={() => set((s) => ({ posts: s.posts.map((x) => (x.id === p.id ? { ...x, reactions: { ...x.reactions, [r]: (x.reactions[r] ?? 0) + 1 } } : x)) }))} className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold hover:bg-secondary">
                    {r} {p.reactions[r] ?? ''}
                  </button>
                ))}
                <Btn size="sm" variant="ghost" onClick={() => setOpenC(openC === p.id ? null : p.id)}><MessageCircle /> {p.comments.length}</Btn>
                <Btn size="sm" variant="ghost" className="ml-auto" onClick={() => { set((s) => ({ posts: s.posts.map((x) => (x.id === p.id ? { ...x, reported: true } : x)) })); toast.success('Reported to moderators. Thank you!') }}><Flag /> Report</Btn>
              </div>
              {openC === p.id && (
                <div className="flex flex-col gap-2 border-t border-border pt-3">
                  {p.comments.map((c, i) => <p key={i} className="rounded-2xl bg-muted px-3 py-2 text-sm"><strong>{c.author}: </strong>{c.body}</p>)}
                  <div className="flex gap-2">
                    <Input aria-label="Write a comment" placeholder="Say something kind…" value={comment[p.id] ?? ''} onChange={(e) => setComment({ ...comment, [p.id]: e.target.value })} />
                    <Btn size="sm" disabled={!comment[p.id]?.trim()} onClick={() => {
                      if (blocked.test(comment[p.id])) return toast.error('Please keep comments kind.')
                      set((s) => ({ posts: s.posts.map((x) => (x.id === p.id ? { ...x, comments: [...x.comments, { author: s.user.name || 'Learner', body: comment[p.id] }] } : x)) }))
                      setComment({ ...comment, [p.id]: '' })
                    }}>Send</Btn>
                  </div>
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
