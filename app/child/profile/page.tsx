'use client'

import { UserRound } from 'lucide-react'
import { Avatar, Badge, Btn, Card, PageHeader } from '@/components/ls/ui'
import { useStore } from '@/lib/store'

export default function ProfilePage() {
  const { state, hydrated, level } = useStore()
  const { user } = state
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My profile" icon={UserRound} actions={<Btn href="/child/settings">Edit profile</Btn>} />
      {hydrated && <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user.name || 'Learner'} src={user.photo} size={64} />
          <div>
            <h2 className="text-2xl font-semibold">{user.name || 'Learner'}</h2>
            {user.grade && <p className="text-muted-foreground">{user.grade}</p>}
            {user.email && <p className="text-muted-foreground">{user.email}</p>}
          </div>
        </div>
        {user.bio && <p className="whitespace-pre-wrap">{user.bio}</p>}
        {user.interests.length > 0 && <div className="flex flex-wrap gap-2">{user.interests.map((interest) => <Badge key={interest}>{interest}</Badge>)}</div>}
        <p>Level {level} · {state.xp} XP · {state.completedLessons.length} lessons completed</p>
      </Card>}
    </div>
  )
}
