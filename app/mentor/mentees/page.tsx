import { requireAccount } from '@/lib/auth'
import { connections, menteeFamilies } from '@/lib/connections'
import { Btn, Card, PageHeader } from '@/components/ls/ui'

export default async function MyMenteesPage() {
  const mentor = await requireAccount('mentor')
  const roster = menteeFamilies(mentor)
  const linked = connections(mentor)
  const directParents = linked.filter(person => person.role === 'parent' && person.accepted)
  const pending = linked.filter(person => !person.accepted && !person.outgoing)
  return <div className="space-y-5">
    <PageHeader title="My Mentees" />
    <div className="flex flex-wrap gap-2">
      <Btn href="/mentor/connections">Search learners and parents</Btn>
      <Btn href="/mentor/learning" variant="outline">Assign work</Btn>
    </div>
    {pending.length > 0 && <Card className="space-y-2">
      <h2 className="text-xl font-semibold">Pending requests</h2>
      {pending.map(person => <p key={person.id}><strong>{person.name}</strong>{person.purpose && <span className="block whitespace-pre-wrap break-words">{person.purpose}</span>}</p>)}
      <Btn href="/mentor/connections" size="sm">Review requests</Btn>
    </Card>}
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Learners and their parents</h2>
      {!roster.length && <p>Accepted learners will appear here.</p>}
      {roster.map(learner => <div key={learner.id} className="space-y-2 border-t border-border pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{learner.name}</h3>
          <Btn href={'/mentor/connections?chat=' + learner.id} size="sm">Message learner</Btn>
        </div>
        {learner.purpose && <p className="whitespace-pre-wrap break-words text-sm">{learner.purpose}</p>}
        {!learner.parents.length && <p className="text-sm text-muted-foreground">No connected parents listed for this learner.</p>}
        {learner.parents.map(parent => {
          const direct = directParents.find(person => person.personId === parent.id)
          return <div key={parent.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>{parent.name} · Parent</span>
            {direct ? <Btn href={'/mentor/connections?chat=' + direct.id} size="sm" variant="outline">Message parent</Btn> :
              <Btn href={'/mentor/connections?q=' + encodeURIComponent(parent.name)} size="sm" variant="outline">Find parent</Btn>}
          </div>
        })}
      </div>)}
    </Card>
    {directParents.length > 0 && <Card className="space-y-3">
      <h2 className="text-xl font-semibold">Connected parents</h2>
      {directParents.map(parent => <div key={parent.id} className="flex flex-wrap items-center justify-between gap-2">
        <div><p className="font-semibold">{parent.name}</p>{parent.purpose && <p className="whitespace-pre-wrap break-words text-sm">{parent.purpose}</p>}</div>
        <Btn href={'/mentor/connections?chat=' + parent.id} size="sm" variant="outline">Message parent</Btn>
      </div>)}
    </Card>}
  </div>
}
