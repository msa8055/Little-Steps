import { currentAccount } from '@/lib/auth'
import { saveProgress } from '@/lib/learning-db'

export async function PUT(request: Request) {
  const account = await currentAccount()
  if (account?.role !== 'child') return new Response(null, { status: 403 })
  if (request.headers.get('sec-fetch-site') === 'cross-site' ||
      !request.headers.get('content-type')?.startsWith('application/json')) {
    return new Response(null, { status: 415 })
  }
  const progress = await request.json().catch(() => null)
  const valid = progress && saveProgress(account, progress.xp, progress.lessons, progress.tasks)
  return new Response(null, { status: valid ? 204 : 400 })
}
