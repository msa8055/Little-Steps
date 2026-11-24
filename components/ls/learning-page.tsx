import { requireAccount } from '@/lib/auth'
import { childMentors, connections, network } from '@/lib/connections'
import { learnerProgress, workFor } from '@/lib/learning-db'
import { updatePeople } from '@/lib/connection-actions'
import { updateLearning } from '@/lib/learning-actions'
import { Btn, Card, Input, PageHeader, Select, Textarea } from './ui'

export default async function LearningPage({ searchParams }: { searchParams: Promise<{ q?: string; thread?: string }> }) {
  const account = await requireAccount()
  const base = '/' + account.role + '/learning'
  const peers = account.role === 'mentor' ? connections(account).filter(person => person.accepted && person.role === 'child') : []
  const parentLinks = account.role === 'parent' ? connections(account) : []
  const familyMentors = childMentors(account)
  const work = workFor(account)
  const progress = learnerProgress(account)
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q.trim().slice(0, 254) : ''
  const adminDb = account.role === 'admin' ? network() : null
  const directory = adminDb?.prepare(`SELECT name, email, role FROM accounts
    WHERE instr(lower(name), lower(?)) > 0 OR instr(email, lower(?)) > 0 ORDER BY name LIMIT 100`).all(query, query) ?? []
  const links = adminDb?.prepare(`SELECT c.id, c.accepted, a.name AS first, b.name AS second
    FROM connections c JOIN accounts a ON a.id=c.first_id JOIN accounts b ON b.id=c.second_id
    ORDER BY c.id DESC LIMIT 100`).all() ?? []
  const thread = Number(params.thread)
  const transcript = adminDb && Number.isSafeInteger(thread) && thread > 0
    ? adminDb.prepare(`SELECT m.id, a.name, m.body FROM direct_messages m JOIN accounts a ON a.id=m.sender
        WHERE m.connection_id=? ORDER BY m.id DESC LIMIT 100`).all(thread) : []

  return <div className="space-y-6">
    <PageHeader title={account.role === 'admin' ? 'Accounts and learning oversight' : account.role === 'child' ? 'Mentor assignments' : account.role === 'parent' ? 'Learner progress' : 'Mentor workspace'} />
    {account.role !== 'admin' && <Btn href={'/' + account.role + '/connections'} variant="outline">Find accounts and send messages</Btn>}
    {account.role === 'parent' && <Card className="space-y-3">
      <h2 className="text-xl font-semibold">Your children’s mentors</h2>
      <Btn href="/parent/family" variant="outline">Add a child in Family Hub</Btn>
      {!familyMentors.length && <p className="text-sm text-muted-foreground">Accepted mentors appear when a connected learner starts a mentorship.</p>}
      {familyMentors.map(row => {
        const connection = parentLinks.find(link => link.personId === row.id)
        return <div key={String(row.learner) + ':' + row.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <div><p className="font-semibold">{String(row.name)}{row.specialty && ' · ' + row.specialty}</p><p className="text-sm">Mentor for {String(row.learner)}</p></div>
          {connection?.accepted ? <Btn href={'/parent/connections?chat=' + connection.id} size="sm">Message mentor</Btn> :
            connection ? <Btn href="/parent/connections" variant="outline" size="sm">View connection request</Btn> :
            <form action={updatePeople}>
              <input type="hidden" name="operation" value="mentorship" />
              <input type="hidden" name="person" value={String(row.id)} />
              <input type="hidden" name="purpose" value={'Discuss the mentorship of ' + String(row.learner)} />
              <Btn type="submit" size="sm">Ask to connect</Btn>
            </form>}
        </div>
      })}
    </Card>}
    {account.role !== 'child' && <Card className="space-y-3">
      <h2 className="text-xl font-semibold">Learner progress</h2>
      {!progress.length && <p className="text-muted-foreground">No learners to show yet.</p>}
      {progress.map(row => <div key={String(row.id)} className="border-t border-border pt-3">
        <p className="font-semibold">{String(row.name)}</p>
        <p className="text-sm">{row.updated ? `${row.xp} XP · ${row.lessons} lessons completed · ${row.tasks} self-study tasks completed` : 'Self-study progress has not synced yet.'}</p>
        <p className="text-sm">{String(row.submitted)} of {String(row.assigned)} mentor assignments submitted</p>
      </div>)}
    </Card>}
    {account.role === 'mentor' && <Card className="space-y-3">
      <h2 className="text-xl font-semibold">Assign work</h2>
      {!peers.length ? <p>Connect with a learner before assigning work.</p> : <form action={updateLearning} className="space-y-3">
        <input type="hidden" name="operation" value="assign" />
        <label className="block space-y-1"><span className="block text-sm font-medium">Learner</span><Select name="learner" required defaultValue=""><option value="">Choose a learner</option>{peers.map(peer => <option key={peer.personId} value={peer.personId}>{peer.name}</option>)}</Select></label>
        <label className="block space-y-1"><span className="block text-sm font-medium">Type</span><Select name="kind"><option>Task</option><option>Exam</option><option>Instructions</option></Select></label>
        <label className="block space-y-1"><span className="block text-sm font-medium">Title</span><Input name="title" required maxLength={120} /></label>
        <label className="block space-y-1"><span className="block text-sm font-medium">Instructions or exam questions</span><Textarea name="instructions" required maxLength={4000} rows={4} /></label>
        <Btn type="submit">Assign to learner</Btn>
      </form>}
    </Card>}
    {account.role !== 'parent' && <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Assigned work</h2>
      {!work.length && <p className="text-muted-foreground">No mentor assignments yet.</p>}
      {work.map(row => <article key={String(row.id)} className="space-y-2 border-t border-border pt-4">
        <h3 className="font-semibold">{String(row.kind)} · {String(row.title)}</h3>
        <p className="text-sm text-muted-foreground">{String(row.mentor_name)} → {String(row.learner_name)} · {row.submitted ? 'Submitted' : 'Awaiting response'}</p>
        <p className="whitespace-pre-wrap break-words">{String(row.instructions)}</p>
        {row.submitted && <p className="whitespace-pre-wrap break-words"><strong>Response</strong> {String(row.submission)}</p>}
        {row.feedback && <p className="whitespace-pre-wrap break-words"><strong>Feedback</strong> {String(row.feedback)} {row.score !== null && `· ${row.score}/100`}</p>}
        {account.role === 'child' && !row.submitted && <form action={updateLearning} className="space-y-2">
          <input type="hidden" name="operation" value="submit" /><input type="hidden" name="id" value={String(row.id)} />
          <label className="block space-y-1"><span className="block text-sm font-medium">Your response</span><Textarea name="response" required maxLength={4000} rows={3} /></label>
          <Btn type="submit" size="sm">Submit response</Btn>
        </form>}
        {account.role === 'mentor' && Boolean(row.submitted) && <form action={updateLearning} className="space-y-2">
          <input type="hidden" name="operation" value="review" /><input type="hidden" name="id" value={String(row.id)} />
          <label className="block space-y-1"><span className="block text-sm font-medium">Feedback</span><Textarea name="feedback" required maxLength={4000} defaultValue={String(row.feedback ?? '')} rows={3} /></label>
          <label className="block space-y-1"><span className="block text-sm font-medium">Score out of 100 (optional)</span><Input name="score" type="number" min={0} max={100} defaultValue={row.score === null ? '' : String(row.score)} /></label>
          <Btn type="submit" size="sm">Save feedback</Btn>
        </form>}
      </article>)}
    </Card>}
    {adminDb && <>
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Registered accounts</h2>
        <form action={base} className="flex gap-2"><Input name="q" defaultValue={query} maxLength={254} aria-label="Search registered accounts" /><Btn type="submit">Search</Btn></form>
        {!directory.length && <p>No matching accounts.</p>}
        {directory.map(row => <div key={String(row.email)} className="border-t border-border pt-2">{String(row.name)} · {String(row.email)} · {String(row.role)}</div>)}
      </Card>
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Connections and conversations</h2>
        {!links.length && <p>No connection requests.</p>}
        {links.map(row => <div key={String(row.id)} className="flex flex-wrap items-center justify-between gap-2">
          <span>{String(row.first)} ↔ {String(row.second)} · {row.accepted ? 'Connected' : 'Pending'}</span>
          {Boolean(row.accepted) && <Btn href={base + '?thread=' + row.id} size="sm" variant="outline">View conversation</Btn>}
        </div>)}
        {thread > 0 && <div className="space-y-2 border-t border-border pt-3">
          <h3 className="font-semibold">Conversation</h3>
          {!transcript.length && <p>No messages in this conversation.</p>}
          {transcript.reverse().map(row => <p key={String(row.id)} className="whitespace-pre-wrap break-words"><strong>{String(row.name)}</strong> {String(row.body)}</p>)}
        </div>}
      </Card>
    </>}
  </div>
}
