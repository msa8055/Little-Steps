import { cookies } from 'next/headers'
import { emailPattern } from './auth-rules'

export const savedEmailsCookie = 'littlesteps_saved_emails'
const limit = 4

export function parseSavedEmails(value?: string): string[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.filter((email): email is string =>
      typeof email === 'string' && email.length <= 254 && emailPattern.test(email)
    ))].slice(0, limit)
  } catch {
    return []
  }
}

export async function savedEmails() {
  return parseSavedEmails((await cookies()).get(savedEmailsCookie)?.value)
}

export async function rememberEmail(email: string, secure: boolean) {
  const jar = await cookies()
  const previous = parseSavedEmails(jar.get(savedEmailsCookie)?.value)
  const emails = [email, ...previous.filter((saved) => saved !== email)].slice(0, limit)
  while (encodeURIComponent(JSON.stringify(emails)).length > 3000) emails.pop()
  jar.set(savedEmailsCookie, JSON.stringify(emails), {
    httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 90 * 24 * 60 * 60,
  })
}

