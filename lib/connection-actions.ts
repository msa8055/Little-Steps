'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAccount } from './auth'
import { changeConnection, requestConnection, sendMessage } from './connections'

export async function updatePeople(form: FormData) {
  const account = await requireAccount()
  if (account.role === 'admin') redirect('/admin')
  const base = '/' + account.role + '/connections'
  const operation = form.get('operation')
  const id = Number(form.get('connection'))
  if (operation === 'mentorship') {
    if (account.role !== 'child' && account.role !== 'parent') redirect(base)
    const sent = requestConnection(account, String(form.get('person') ?? ''), String(form.get('purpose') ?? ''))
    const mentors = '/' + account.role + '/mentors'
    revalidatePath(base)
    revalidatePath(mentors)
    redirect(mentors + (sent ? '?sent=1' : '?sent=0'))
  }
  if (operation === 'request') {
    requestConnection(account, String(form.get('person') ?? ''))
  } else if (Number.isSafeInteger(id) && id > 0) {
    if (operation === 'accept' || operation === 'remove') changeConnection(account, id, operation)
    if (operation === 'send') {
      sendMessage(account, id, String(form.get('body') ?? ''))
      revalidatePath(base)
      redirect(base + '?chat=' + id)
    }
  }
  revalidatePath(base)
  redirect(base)
}
