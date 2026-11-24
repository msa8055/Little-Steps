'use server'

import { revalidatePath } from 'next/cache'
import { requireAccount } from './auth'
import { assignWork, reviewWork, submitWork } from './learning-db'

export async function updateLearning(form: FormData) {
  const account = await requireAccount()
  const text = (field: string) => String(form.get(field) ?? '').trim()
  const id = Number(text('id'))
  const operation = text('operation')
  if (operation === 'assign') assignWork(account, text('learner'), text('kind'), text('title'), text('instructions'))
  if (Number.isSafeInteger(id) && id > 0) {
    if (operation === 'submit') submitWork(account, id, text('response'))
    if (operation === 'review') reviewWork(account, id, text('feedback'), text('score') ? Number(text('score')) : null)
  }
  revalidatePath('/' + account.role + '/learning')
}
