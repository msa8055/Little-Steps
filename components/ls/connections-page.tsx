import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { redirect } from 'next/navigation'
import { requireAccount } from '@/lib/auth'
import { updatePeople } from '@/lib/connection-actions'
import { connections, findPeople, messages } from '@/lib/connections'
import { specialties } from '@/lib/specialties'
import { ChatRefresh } from './chat-refresh'
import { Btn, Card, Input, PageHeader, Select, Textarea } from './ui'

function ConnectionButton({ operation, connection, person, label }: {
  operation: 'request' | 'accept' | 'remove'; connection?: number; person?: string; label: string
}) {
  return <form action={updatePeople}>
    <input type="hidden" name="operation" value={operation} />
    {connection && <input type="hidden" name="connection" value={connection} />}
    {person && <input type="hidden" name="person" value={person} />}
    <Btn type="submit" size="sm" variant={operation === 'remove' ? 'outline' : 'primary'}>{label}</Btn>
  </form>
}

type Query = { q?: string | string[]; chat?: string | string[]; before?: string | string[]; sent?: string | string[]; specialty?: string }

export default function ConnectionsPage({ searchParams }: { searchParams: Promise<Query> }) {
  return <PeoplePage searchParams={searchParams} />
}

export async function PeoplePage({ searchParams, mentorsOnly = false }: { searchParams: Promise<Query>; mentorsOnly?: boolean }) {
  const account = await requireAccount()
  if (account.role === 'admin') redirect('/admin')
  const base = '/' + account.role + '/connections'
  const searchPath = mentorsOnly ? '/' + account.role + '/mentors' : base
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q.trim().slice(0, 254) : ''
  const chat = typeof params.chat === 'string' ? Number(params.chat) : 0
  const before = typeof params.before === 'string' ? Number(params.before) : 0
  const linked = connections(account).filter(person => !mentorsOnly || person.role === 'mentor')
  const specialty = mentorsOnly && specialties.some(item => item === params.specialty) ? params.specialty : ''
  const results = query || mentorsOnly ? findPeople(account, query, mentorsOnly, specialty) : []
  const peer = linked.find(item => item.id === chat && item.accepted)
  const thread = peer ? messages(account, peer.id, Number.isSafeInteger(before) && before > 0 ? before : undefined) : []
  const visible = thread.slice(0, 50)
  const oldest = visible.at(-1)
  return <div className="space-y-6">
    <PageHeader title={mentorsOnly ? "Find a Mentor" : "Connections and messages"} />
    {mentorsOnly && params.sent === "1" && <p role="status">Mentorship request sent.</p>}
    {mentorsOnly && params.sent === "0" && <p role="status">Could not send a new request. Check your existing requests and enter a purpose.</p>}
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold">{mentorsOnly ? "Search mentors" : "Find an account"}</h2>
          <p className="text-sm text-muted-foreground">{mentorsOnly ? "Browse by specialty or search by name or email." : account.role === "mentor" ? "Search for a learner or parent by name or exact email." : "Search by exact email, or look up a parent or mentor by name."}</p>
          <form action={searchPath} className="flex gap-2">
            <Input name="q" defaultValue={query} aria-label="Name or email" required={!mentorsOnly} minLength={2} maxLength={254} />
            {mentorsOnly && <Select name="specialty" aria-label="Mentor specialty" defaultValue={specialty}><option value="">All specialties</option>{specialties.map(item => <option key={item}>{item}</option>)}</Select>}
            <Btn type="submit">Search</Btn>
          </form>
          {(query || mentorsOnly) && results.length === 0 && <p className="text-sm">No matching accounts found.</p>}
          {results.map(person => {
            const existing = linked.find(item => item.personId === person.id)
            return <div key={person.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <p><strong>{person.name}</strong> · {person.role === 'child' ? 'Learner' : person.role}{person.specialty && ' · ' + person.specialty}</p>
              {existing?.accepted ? <Btn href={base + '?chat=' + existing.id} size="sm">Message</Btn> :
                existing ? <span className="text-sm text-muted-foreground">Request pending</span> :
                  person.role === 'mentor' ? <form action={updatePeople} className="w-full space-y-2">
                    <input type="hidden" name="operation" value="mentorship" />
                    <input type="hidden" name="person" value={person.id} />
                    <label className="block text-sm font-medium">Purpose of the request
                      <Textarea name="purpose" required maxLength={500} rows={2} placeholder="What would you like help with?" />
                    </label>
                    <Btn type="submit" size="sm">Request mentorship</Btn>
                  </form> : <ConnectionButton operation="request" person={person.id} label="Connect" />}
            </div>
          })}
        </Card>
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold">{mentorsOnly ? "Your mentor requests and connections" : "Your connections"}</h2>
          {!linked.length && <p className="text-sm text-muted-foreground">Accepted connections and pending requests will appear here.</p>}
          {linked.map(person => <div key={person.id} className="space-y-2 border-t border-border pt-3">
            <p><strong>{person.name}</strong> · {person.role === 'child' ? 'Learner' : person.role}</p>
            {person.purpose && <p className="whitespace-pre-wrap break-words text-sm"><strong>Purpose</strong> {person.purpose}</p>}
            {!person.accepted && <p className="text-sm text-muted-foreground">{person.outgoing ? 'Request sent' : 'Incoming request'}</p>}
            <div className="flex flex-wrap gap-2">
              {person.accepted && <Btn href={base + '?chat=' + person.id} size="sm">Message</Btn>}
              {!person.accepted && !person.outgoing && <ConnectionButton operation="accept" connection={person.id} label="Accept" />}
              {!person.accepted && <ConnectionButton operation="remove" connection={person.id} label={person.outgoing ? 'Cancel request' : 'Decline'} />}
            </div>
          </div>)}
        </Card>
      </div>
      <Card className="space-y-4">
        {peer ? <>
          <ChatRefresh />
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{peer.name}</h2>
            <Btn href={base + '?chat=' + peer.id + '&view=' + Date.now()} variant="outline" size="sm">Refresh messages</Btn>
          </div>
          {thread.length > 50 && oldest && <Link className="text-sm font-semibold text-primary underline" href={base + '?chat=' + peer.id + '&before=' + oldest.id}>Older messages</Link>}
          {visible.length === 0 && <p className="text-sm text-muted-foreground">Start your conversation below.</p>}
          <ul className="space-y-2">
            {visible.reverse().map(message => <li key={message.id} className={'max-w-[85%] rounded-xl p-3 ' + (message.mine ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted')}>
              <p className="whitespace-pre-wrap break-words">{message.body}</p>
              <time className="text-xs opacity-75" dateTime={new Date(message.created).toISOString()}>{new Date(message.created).toISOString().slice(0, 16).replace('T', ' ')} UTC</time>
            </li>)}
          </ul>
          <form action={updatePeople} className="space-y-2">
            <input type="hidden" name="operation" value="send" />
            <input type="hidden" name="connection" value={peer.id} />
            <Textarea name="body" aria-label={'Message to ' + peer.name} required maxLength={2000} rows={3} />
            <Btn type="submit">Send message</Btn>
          </form>
        </> : <p className="flex items-center gap-2 text-muted-foreground"><MessageSquare size={18} /> Choose an accepted connection to open a conversation.</p>}
      </Card>
    </div>
  </div>
}
