import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sessionAccount } from './auth-db'
import type { Role } from './store'

export const sessionCookie = 'littlesteps_session'

export const currentAccount = cache(async () => sessionAccount((await cookies()).get(sessionCookie)?.value))

export async function requireAccount(role?: Role) {
  const account = await currentAccount()
  if (!account) redirect('/login')
  if (role && role !== account.role) redirect('/' + account.role)
  return account
}
