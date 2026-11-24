import type { Account } from './auth-db'
import { network } from './connections'
import { specialties } from './specialties'

function familyDb() {
  const db = network()
  db.exec(`
    CREATE TABLE IF NOT EXISTS family_members (
      owner TEXT NOT NULL REFERENCES accounts(id), member TEXT NOT NULL REFERENCES accounts(id),
      accepted INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(owner, member)
    );
    CREATE TABLE IF NOT EXISTS family_goals (
      id INTEGER PRIMARY KEY, owner TEXT NOT NULL REFERENCES accounts(id),
      goal TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0
    );
  `)
  return db
}

export function setSpecialty(account: Account, specialty: string) {
  if (account.role !== 'mentor' || !specialties.some(item => item === specialty)) return
  network().prepare(`INSERT INTO mentor_specialties VALUES (?, ?)
    ON CONFLICT(mentor) DO UPDATE SET specialty=excluded.specialty`).run(account.id, specialty)
}

export function getSpecialty(account: Account) {
  return String(network().prepare('SELECT specialty FROM mentor_specialties WHERE mentor=?').get(account.id)?.specialty ?? '')
}

export function inviteFamily(account: Account, email: string) {
  if (account.role !== 'parent' || !email || email.length > 254) return false
  const result = familyDb().prepare(`INSERT INTO family_members(owner, member)
    SELECT ?, id FROM accounts WHERE email=? AND id<>? AND role IN ('child','parent')
    ON CONFLICT(owner,member) DO NOTHING`).run(account.id, email.toLowerCase(), account.id)
  return Boolean(result.changes)
}

export function replyFamily(account: Account, owner: string, accept: boolean) {
  if (!['child','parent'].includes(account.role)) return
  const db = familyDb()
  db.exec('BEGIN IMMEDIATE')
  try {
    if (accept) {
      const accepted = db.prepare('UPDATE family_members SET accepted=1 WHERE owner=? AND member=? AND accepted=0').run(owner, account.id)
      if (accepted.changes && account.role === 'child') {
        const [first, second] = [owner, account.id].sort()
        db.prepare(`INSERT INTO connections(first_id,second_id,sender,accepted) VALUES (?,?,?,1)
          ON CONFLICT(first_id,second_id) DO UPDATE SET accepted=1`).run(first,second,owner)
      }
    } else {
      db.prepare('DELETE FROM family_members WHERE owner=? AND member=? AND accepted=0').run(owner,account.id)
    }
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function postGoal(account: Account, goal: string) {
  if (account.role !== 'parent' || !goal || goal.length > 500) return
  familyDb().prepare('INSERT INTO family_goals(owner,goal) VALUES (?,?)').run(account.id,goal)
}

export function toggleGoal(account: Account, id: number) {
  if (account.role !== 'parent') return
  familyDb().prepare('UPDATE family_goals SET done=1-done WHERE id=? AND owner=?').run(id, account.id)
}

export function familyHub(account: Account) {
  const db = familyDb()
  const members = db.prepare(`SELECT a.name,a.role,f.accepted FROM family_members f
    JOIN accounts a ON a.id=f.member WHERE f.owner=? ORDER BY a.name`).all(account.id)
  const invitations = db.prepare(`SELECT a.id,a.name FROM family_members f
    JOIN accounts a ON a.id=f.owner WHERE f.member=? AND f.accepted=0 ORDER BY a.name`).all(account.id)
  const goals = db.prepare(`SELECT g.id,g.goal,g.done,a.name,g.owner FROM family_goals g JOIN accounts a ON a.id=g.owner
    WHERE g.owner=? OR EXISTS (SELECT 1 FROM family_members f WHERE f.owner=g.owner AND f.member=? AND f.accepted=1)
    ORDER BY g.id DESC`).all(account.id,account.id)
  return { members,invitations,goals }
}
