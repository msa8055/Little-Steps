import { Welcome } from '@/components/auth/forms'
import { requireAccount } from '@/lib/auth'

export default async function Page() {
  await requireAccount('child')
  return <Welcome />
}
