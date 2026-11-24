'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAccount } from './auth'
import { inviteFamily, postGoal, replyFamily, setSpecialty, toggleGoal } from './family-db'

export async function updateFamily(form: FormData) {
  const account = await requireAccount()
  if (account.role !== 'parent' && account.role !== 'child') redirect('/' + account.role)
  const field = (name: string) => String(form.get(name) ?? '').trim()
  const operation = field('operation')
  const base = '/' + account.role + '/family'
  if (operation === 'invite') {
    const sent = inviteFamily(account, field('email'))
    revalidatePath(base)
    redirect(base + '?invite=' + (sent ? 'sent' : 'unavailable'))
  }
  if (operation === 'accept' || operation === 'decline') replyFamily(account, field('owner'), operation === 'accept')
  if (operation === 'goal') postGoal(account, field('goal'))
  if (operation === 'toggle') toggleGoal(account, Number(field('goalId')))
  revalidatePath(base)
  redirect(base)
}

export async function updateSpecialty(form: FormData) {
  const account = await requireAccount('mentor')
  setSpecialty(account, String(form.get('specialty') ?? ''))
  revalidatePath('/mentor/profile')
  redirect('/mentor/profile?saved=1')
}
