'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { allowAttempt, authenticate, createAccount, issueSession, revokeSession, sessionLifetime } from './auth-db'
import { sessionCookie } from './auth'

import { emailPattern, maximumPasswordLength, minimumPasswordLength } from './auth-rules'
import { rememberEmail, savedEmailsCookie } from './saved-emails'

async function secureTransport() {
  const origin = (await headers()).get('origin')
  if (origin) {
    const url = URL.parse(origin)
    if (url?.protocol === 'https:') return true
    if (url?.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return false
  }
  throw new Error('Authentication requires HTTPS or a local browser connection.')
}

export async function login(form: FormData) {
  const secure = await secureTransport()
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const password = String(form.get('password') ?? '')
  if (email.length > 254 || !emailPattern.test(email) || password.length > maximumPasswordLength || !password) redirect('/login?error=invalid')
  if (!allowAttempt('login', email)) redirect('/login?error=rate')
  const account = await authenticate(email, password)
  if (!account) redirect('/login?error=invalid')
  const jar = await cookies()
  revokeSession(jar.get(sessionCookie)?.value)
  jar.set(sessionCookie, issueSession(account.id), { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: sessionLifetime })
  if (form.get('rememberEmail') === 'on') await rememberEmail(account.email, secure)
  redirect('/' + account.role)
}

export async function register(form: FormData) {
  const secure = await secureTransport()
  const name = String(form.get('name') ?? '').trim()
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const password = String(form.get('password') ?? '')
  const role = form.get('role')
  if (name.length < 2 || name.length > 80 || email.length > 254 || !emailPattern.test(email) ||
      password.length < minimumPasswordLength || password.length > maximumPasswordLength || password !== form.get('confirmPassword') ||
      (role !== 'child' && role !== 'parent' && role !== 'mentor')) redirect('/register?error=invalid')
  if (!allowAttempt('register', email)) redirect('/register?error=rate')
  const account = await createAccount(name, email, password, role)
  if (!account) redirect('/register?error=unavailable')
  const jar = await cookies()
  revokeSession(jar.get(sessionCookie)?.value)
  jar.set(sessionCookie, issueSession(account.id), { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: sessionLifetime })
  if (form.get('rememberEmail') === 'on') await rememberEmail(account.email, secure)
  redirect(role === 'child' ? '/onboarding' : '/' + role)
}

export async function logout() {
  await secureTransport()
  const jar = await cookies()
  revokeSession(jar.get(sessionCookie)?.value)
  jar.delete(sessionCookie)
  redirect('/login')
}

export async function clearSavedEmails() {
  await secureTransport()
  const jar = await cookies()
  jar.delete(savedEmailsCookie)
  redirect('/login')
}
