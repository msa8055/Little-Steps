import { resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const email = process.argv[2]?.trim().toLowerCase()
if (!email) {
  console.error('Usage: npm run auth:promote -- someone@example.com')
  process.exit(1)
}

const filename = resolve(process.env.LITTLESTEPS_AUTH_DB || '.littlesteps/accounts.sqlite')
const database = new DatabaseSync(filename, { timeout: 5000 })
try {
  database.exec('BEGIN IMMEDIATE')
  const account = database.prepare("UPDATE accounts SET role = 'admin' WHERE email = ?").run(email)
  database.prepare('DELETE FROM sessions WHERE account_id = (SELECT id FROM accounts WHERE email = ?)').run(email)
  database.exec('COMMIT')
  if (!account.changes) {
    console.error('Register the account in LittleSteps before promoting it.')
    process.exitCode = 1
  } else {
    console.log('Administrator role assigned. The account can now sign in to the admin dashboard.')
  }
} finally {
  database.close()
}

