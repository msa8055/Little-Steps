import type { Account } from './auth-db'
import { network } from './connections'

function learningDb() {
  const database = network()
  database.exec(`
    CREATE TABLE IF NOT EXISTS learner_progress (
      learner TEXT PRIMARY KEY REFERENCES accounts(id), xp INTEGER NOT NULL,
      lessons INTEGER NOT NULL, tasks INTEGER NOT NULL, updated INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mentor_work (
      id INTEGER PRIMARY KEY, mentor TEXT NOT NULL REFERENCES accounts(id),
      learner TEXT NOT NULL REFERENCES accounts(id), kind TEXT NOT NULL,
      title TEXT NOT NULL, instructions TEXT NOT NULL, created INTEGER NOT NULL,
      submission TEXT, submitted INTEGER, feedback TEXT, score INTEGER
    );
    CREATE INDEX IF NOT EXISTS mentor_work_learner ON mentor_work(learner, id);
    CREATE INDEX IF NOT EXISTS mentor_work_mentor ON mentor_work(mentor, id);
  `)
  return database
}

export function saveProgress(account: Account, xp: number, lessons: number, tasks: number) {
  if (account.role !== 'child' || ![xp, lessons, tasks].every(value => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000)) return false
  learningDb().prepare(`INSERT INTO learner_progress VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(learner) DO UPDATE SET xp=excluded.xp, lessons=excluded.lessons, tasks=excluded.tasks, updated=excluded.updated`)
    .run(account.id, xp, lessons, tasks, Date.now())
  return true
}

const linked = (peer: string) => `EXISTS (SELECT 1 FROM connections c WHERE c.accepted = 1
  AND ((c.first_id = ? AND c.second_id = ${peer}) OR (c.second_id = ? AND c.first_id = ${peer})))`

export function assignWork(account: Account, learner: string, kind: string, title: string, instructions: string) {
  if (account.role !== 'mentor' || !['Task', 'Exam', 'Instructions'].includes(kind)) return
  if (!title || title.length > 120 || !instructions || instructions.length > 4000) return
  learningDb().prepare(`INSERT INTO mentor_work(mentor, learner, kind, title, instructions, created)
    SELECT ?, a.id, ?, ?, ?, ? FROM accounts a WHERE a.id = ? AND a.role='child' AND ${linked('a.id')}`)
    .run(account.id, kind, title, instructions, Date.now(), learner, account.id, account.id)
}

export function submitWork(account: Account, id: number, response: string) {
  if (account.role !== 'child' || !response || response.length > 4000) return
  learningDb().prepare(`UPDATE mentor_work SET submission=?, submitted=?
    WHERE id=? AND learner=? AND submitted IS NULL`).run(response, Date.now(), id, account.id)
}

export function reviewWork(account: Account, id: number, feedback: string, score: number | null) {
  if (account.role !== 'mentor' || !feedback || feedback.length > 4000 ||
      (score !== null && (!Number.isInteger(score) || score < 0 || score > 100))) return
  learningDb().prepare(`UPDATE mentor_work SET feedback=?, score=?
    WHERE id=? AND mentor=? AND submitted IS NOT NULL`).run(feedback, score, id, account.id)
}

export function learnerProgress(account: Account) {
  const database = learningDb()
  const query = `SELECT a.id, a.name, p.xp, p.lessons, p.tasks, p.updated,
    (SELECT count(*) FROM mentor_work w WHERE w.learner=a.id AND w.submitted IS NOT NULL) AS submitted,
    (SELECT count(*) FROM mentor_work w WHERE w.learner=a.id) AS assigned
    FROM accounts a LEFT JOIN learner_progress p ON p.learner=a.id WHERE a.role='child'`
  if (account.role === 'admin') return database.prepare(query + ' ORDER BY a.name').all()
  if (account.role === 'parent' || account.role === 'mentor') return database.prepare(query + ' AND ' + linked('a.id') + ' ORDER BY a.name').all(account.id, account.id)
  return []
}

export function workFor(account: Account, peer?: string) {
  const database = learningDb()
  const query = `SELECT w.*, m.name AS mentor_name, l.name AS learner_name FROM mentor_work w
    JOIN accounts m ON m.id=w.mentor JOIN accounts l ON l.id=w.learner`
  switch (account.role) {
    case 'child': return database.prepare(query + ' WHERE w.learner=? ORDER BY w.id DESC').all(account.id)
    case 'mentor': return database.prepare(query + ' WHERE w.mentor=? AND (? IS NULL OR w.learner=?) ORDER BY w.id DESC').all(account.id, peer ?? null, peer ?? null)
    case 'admin': return database.prepare(query + ' ORDER BY w.id DESC LIMIT 200').all()
    default: return []
  }
}
