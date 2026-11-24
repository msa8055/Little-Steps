import { redirect } from 'next/navigation'
import { requireAccount } from '@/lib/auth'
import { updateFamily } from '@/lib/family-actions'
import { familyHub } from '@/lib/family-db'
import { Btn, Card, Input, PageHeader, Textarea } from './ui'

export default async function FamilyPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const account = await requireAccount()
  if (account.role !== 'parent' && account.role !== 'child') redirect('/' + account.role)
  const { members, invitations, goals } = familyHub(account)
  const { invite } = await searchParams
  return <div className="space-y-4">
    <PageHeader title="Family Hub" />
    {account.role === 'parent' && <Card className="space-y-3">
      <h2 className="text-xl font-semibold">Add a child or family member</h2>
      <p className="text-sm">Enter their registered email. They can accept from their own Family Hub. Accepted child invitations also link their progress.</p>
      {invite && <p role="status">{invite === 'sent' ? 'Family invitation sent.' : 'No new invitation was sent. Check the email and existing invitations.'}</p>}
      <form action={updateFamily} className="flex flex-wrap gap-2">
        <input type="hidden" name="operation" value="invite" />
        <Input type="email" name="email" aria-label="Family member email" required maxLength={254} />
        <Btn type="submit">Invite family member</Btn>
      </form>
      {members.map((member,index) => <p key={index}>{String(member.name)} · {member.role === 'child' ? 'Learner' : 'Parent'} · {member.accepted ? 'Member' : 'Invited'}</p>)}
    </Card>}
    {invitations.length > 0 && <Card className="space-y-3">
      <h2 className="text-xl font-semibold">Family invitations</h2>
      {invitations.map(invitation => <form key={String(invitation.id)} action={updateFamily} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="owner" value={String(invitation.id)} />
        <p className="mr-auto">{String(invitation.name)} invited you.</p>
        <Btn type="submit" name="operation" value="accept" size="sm">Accept</Btn>
        <Btn type="submit" name="operation" value="decline" size="sm" variant="outline">Decline</Btn>
      </form>)}
    </Card>}
    <Card className="space-y-3">
      <h2 className="text-xl font-semibold">Family goals</h2>
      {account.role === 'parent' && <form action={updateFamily} className="space-y-2">
        <input type="hidden" name="operation" value="goal" />
        <Textarea name="goal" aria-label="New family goal" placeholder="What would your family like to achieve?" rows={3} required maxLength={500} />
        <Btn type="submit">Post family goal</Btn>
      </form>}
      {!goals.length && <p className="text-muted-foreground">No family goals yet.</p>}
      {goals.map(goal => <article key={String(goal.id)} className="space-y-2 border-t border-border pt-3">
        <p className="whitespace-pre-wrap break-words font-medium">{String(goal.goal)}</p>
        <p className="text-sm text-muted-foreground">Posted by {String(goal.name)} · {goal.done ? 'Completed' : 'In progress'}</p>
        {goal.owner === account.id && <form action={updateFamily}>
          <input type="hidden" name="operation" value="toggle" /><input type="hidden" name="goalId" value={String(goal.id)} />
          <Btn type="submit" size="sm" variant="outline">{goal.done ? 'Reopen goal' : 'Mark complete'}</Btn>
        </form>}
      </article>)}
    </Card>
  </div>
}
