import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/forms'
import { currentAccount } from '@/lib/auth'
import { savedEmails } from '@/lib/saved-emails'

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const account = await currentAccount()
  if (account) redirect('/' + account.role)
  return <LoginForm error={(await searchParams).error} saved={await savedEmails()} />
}
