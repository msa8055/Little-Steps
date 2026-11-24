import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { promisify } from 'node:util'
import type { Role } from './store'

export type Account = { id: string; name: string; email: string; role: Role }
type Credential = Account & { salt: string; passwordHash: string }
const derive = promisify(scrypt) as (password: string, salt: string, length: number, options: { N: number; r: number; p: number; maxmem: number }) => Promise<Buffer>
// Keep users signed in for 30 days. Account records themselves live in SQLite;
// on Render, point LITTLESTEPS_AUTH_DB at a persistent disk or PostgreSQL for
// records to survive service replacement.
export const sessionLifetime = 30 * 24 * 60 * 60
let connection: DatabaseSync | undefined

export function db() {
  if (connection) return connection
  const filename = resolve(process.env.LITTLESTEPS_AUTH_DB || '.littlesteps/accounts.sqlite')
  mkdirSync(dirname(filename), { recursive: true, mode: 0o700 })
  const database = new DatabaseSync(filename, { timeout: 5000 })
  database.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('child', 'parent', 'mentor', 'admin')),
      salt TEXT NOT NULL, password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      digest TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      expires INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS auth_attempts (
      key TEXT NOT NULL, created INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS attempts_key ON auth_attempts (key, created);
  `)
  connection = database
  return database
}

const digest = (value: string) => createHash('sha256').update(value).digest('hex')
const hashPassword = (password: string, salt: string) => derive(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 })

export function allowAttempt(action: 'login' | 'register', email: string) {
  const database = db()
  const now = Date.now()
  const key = action + ':' + digest(email)
  database.exec('BEGIN IMMEDIATE')
  try {
    database.prepare('DELETE FROM auth_attempts WHERE created <= ?').run(now - 15 * 60_000)
    const total = database.prepare('SELECT count(*) AS count FROM auth_attempts WHERE key = ?').get(key) as { count: number }
    const global = database.prepare('SELECT count(*) AS count FROM auth_attempts').get() as { count: number }
    const allowed = total.count < 8 && global.count < 180
    if (allowed) database.prepare('INSERT INTO auth_attempts (key, created) VALUES (?, ?)').run(key, now)
    database.exec('COMMIT')
    return allowed
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
}

export async function createAccount(name: string, email: string, password: string, role: Exclude<Role, 'admin'>) {
  const salt = randomBytes(16).toString('hex')
  const hash = await hashPassword(password, salt)
  const account = { id: randomUUID(), name, email, role }
  const result = db().prepare('INSERT INTO accounts (id, name, email, role, salt, password_hash) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO NOTHING')
    .run(account.id, name, email, role, salt, hash.toString('hex'))
  return result.changes ? account : null
}

export async function authenticate(email: string, password: string): Promise<Account | null> {
  const row = db().prepare('SELECT id, name, email, role, salt, password_hash AS passwordHash FROM accounts WHERE email = ?').get(email) as Credential | undefined
  const candidate = await hashPassword(password, row?.salt ?? '00000000000000000000000000000000')
  const expected = row ? Buffer.from(row.passwordHash, 'hex') : Buffer.alloc(64)
  if (!timingSafeEqual(candidate, expected) || !row) return null
  const { id, name, role } = row
  return { id, name, email, role }
}

export function issueSession(accountId: string) {
  const token = randomBytes(32).toString('base64url')
  const database = db()
  database.prepare('DELETE FROM sessions WHERE expires <= ?').run(Date.now())
  database.prepare('INSERT INTO sessions (digest, account_id, expires) VALUES (?, ?, ?)').run(digest(token), accountId, Date.now() + sessionLifetime * 1000)
  return token
}

const validToken = (token?: string): token is string => !!token && /^[A-Za-z0-9_-]{43}$/.test(token)

export function sessionAccount(token?: string): Account | null {
  if (!validToken(token)) return null
  const row = db().prepare(`SELECT a.id, a.name, a.email, a.role FROM accounts a
    JOIN sessions s ON s.account_id = a.id WHERE s.digest = ? AND s.expires > ?`).get(digest(token), Date.now()) as Account | undefined
  return row ? { ...row } : null
}

export function revokeSession(token?: string) {
  if (validToken(token)) db().prepare('DELETE FROM sessions WHERE digest = ?').run(digest(token))
}
