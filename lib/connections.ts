import { db, type Account } from './auth-db'

export function network() {
  const database = db()
  database.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY, first_id TEXT NOT NULL REFERENCES accounts(id),
      second_id TEXT NOT NULL REFERENCES accounts(id), sender TEXT NOT NULL REFERENCES accounts(id),
      accepted INTEGER NOT NULL DEFAULT 0, UNIQUE(first_id, second_id)
    );
    CREATE TABLE IF NOT EXISTS mentorship_requests (
      connection_id INTEGER PRIMARY KEY REFERENCES connections(id) ON DELETE CASCADE,
      purpose TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mentor_specialties (
      mentor TEXT PRIMARY KEY REFERENCES accounts(id), specialty TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS direct_messages (
      id INTEGER PRIMARY KEY, connection_id INTEGER NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
      sender TEXT NOT NULL REFERENCES accounts(id), body TEXT NOT NULL, created INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS message_thread ON direct_messages(connection_id, id);
  `)
  return database
}

export function findPeople(account: Account, query: string, mentorsOnly = false, specialty = '') {
  const term = query.trim().toLowerCase()
  if ((term && term.length < 2) || term.length > 254 || (!term && !mentorsOnly)) return []
  return network().prepare(`SELECT a.id, a.name, a.role, s.specialty FROM accounts a LEFT JOIN mentor_specialties s ON s.mentor=a.id WHERE a.id <> ? AND role <> ?
    AND role <> 'admin' AND (? = 0 OR role = 'mentor')
    AND (? = '' OR s.specialty = ?)
    AND (email = ? OR ((role <> 'child' OR ? = 'mentor') AND instr(lower(name), ?) > 0))
    ORDER BY name, id LIMIT 25`).all(account.id, account.role, Number(mentorsOnly), specialty, specialty, term, account.role, term).map(row => ({
      id: String(row.id), name: String(row.name), role: String(row.role), specialty: row.specialty ? String(row.specialty) : null,
    }))
}

export function connections(account: Account) {
  return network().prepare(`SELECT c.id, c.sender, c.accepted, a.name, a.role, a.id AS personId, r.purpose, s.specialty
    FROM connections c JOIN accounts a ON a.id = CASE WHEN first_id = ? THEN second_id ELSE first_id END
    LEFT JOIN mentorship_requests r ON r.connection_id = c.id
    LEFT JOIN mentor_specialties s ON s.mentor = a.id
    WHERE (first_id = ? OR second_id = ?) AND a.role <> ? AND a.role <> 'admin'
    ORDER BY c.accepted DESC, a.name, c.id`).all(account.id, account.id, account.id, account.role).map(row => ({
      id: Number(row.id), outgoing: row.sender === account.id, accepted: row.accepted === 1,
      name: String(row.name), role: String(row.role), personId: String(row.personId), purpose: row.purpose === null ? null : String(row.purpose), specialty: row.specialty ? String(row.specialty) : null,
    }))
}

export function requestConnection(account: Account, target: string, purpose?: string) {
  const [first, second] = [account.id, target].sort()
  const database = network()
  const reason = purpose?.trim()
  if (purpose !== undefined && (!reason || reason.length > 500 || !['child', 'parent'].includes(account.role))) return false
  database.exec('BEGIN IMMEDIATE')
  try {
    const row = database.prepare(`INSERT INTO connections(first_id, second_id, sender)
      SELECT ?, ?, ? FROM accounts WHERE id = ? AND id <> ? AND role <> ? AND role <> 'admin'
      AND ((? = 1 AND role = 'mentor') OR (? = 0 AND role <> 'mentor'))
      ON CONFLICT(first_id, second_id) DO NOTHING RETURNING id`)
      .get(first, second, account.id, target, account.id, account.role, Number(Boolean(reason)), Number(Boolean(reason)))
    if (row && reason) database.prepare('INSERT INTO mentorship_requests VALUES (?, ?)').run(row.id, reason)
    database.exec('COMMIT')
    return Boolean(row)
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
}

export function menteeFamilies(account: Account) {
  if (account.role !== 'mentor') return []
  const database = network()
  const learnerParents = database.prepare(`SELECT a.id, a.name FROM connections c
    JOIN accounts a ON a.id = CASE WHEN c.first_id = ? THEN c.second_id ELSE c.first_id END
    WHERE c.accepted = 1 AND (c.first_id = ? OR c.second_id = ?) AND a.role = 'parent'
    ORDER BY a.name, a.id`)
  return connections(account).filter(peer => peer.accepted && peer.role === 'child').map(learner => ({
    ...learner,
    parents: learnerParents.all(learner.personId, learner.personId, learner.personId).map(row => ({
      id: String(row.id), name: String(row.name),
    })),
  }))
}

export function changeConnection(account: Account, id: number, operation: 'accept' | 'remove') {
  const database = network()
  if (operation === 'accept') {
    database.prepare(`UPDATE connections SET accepted = 1 WHERE id = ? AND (first_id = ? OR second_id = ?)
      AND sender <> ? AND accepted = 0`).run(id, account.id, account.id, account.id)
  } else {
    database.prepare('DELETE FROM connections WHERE id = ? AND (first_id = ? OR second_id = ?)').run(id, account.id, account.id)
  }
}

const membership = `c.id = ? AND c.accepted = 1 AND (c.first_id = ? OR c.second_id = ?)
  AND EXISTS (SELECT 1 FROM accounts peer WHERE peer.id = CASE WHEN c.first_id = ? THEN c.second_id ELSE c.first_id END
  AND peer.role <> 'admin' AND peer.role <> ?)`

export function messages(account: Account, id: number, before = Number.MAX_SAFE_INTEGER) {
  return network().prepare(`SELECT m.id, m.sender, m.body, m.created FROM direct_messages m
    JOIN connections c ON c.id = m.connection_id WHERE ${membership} AND m.id < ?
    ORDER BY m.id DESC LIMIT 51`).all(id, account.id, account.id, account.id, account.role, before).map(row => ({
      id: Number(row.id), mine: row.sender === account.id, body: String(row.body), created: Number(row.created),
    }))
}

export function sendMessage(account: Account, id: number, body: string) {
  const message = body.trim()
  if (!message || message.length > 2000) return
  network().prepare(`INSERT INTO direct_messages(connection_id, sender, body, created)
    SELECT c.id, ?, ?, ? FROM connections c WHERE ${membership}`)
    .run(account.id, message, Date.now(), id, account.id, account.id, account.id, account.role)
}

export function childMentors(parent: Account) {
  if (parent.role !== 'parent') return []
  return network().prepare(`SELECT l.name AS learner, m.id, m.name, s.specialty FROM connections family
    JOIN accounts l ON l.id = CASE WHEN family.first_id=? THEN family.second_id ELSE family.first_id END AND l.role='child'
    JOIN connections pairing ON (pairing.first_id=l.id OR pairing.second_id=l.id) AND pairing.accepted=1
    JOIN accounts m ON m.id=CASE WHEN pairing.first_id=l.id THEN pairing.second_id ELSE pairing.first_id END AND m.role='mentor'
    LEFT JOIN mentor_specialties s ON s.mentor=m.id
    WHERE family.accepted=1 AND (family.first_id=? OR family.second_id=?) ORDER BY l.name, m.name`)
    .all(parent.id,parent.id,parent.id)
}
