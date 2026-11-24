import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/auth/forms'
import { currentAccount } from '@/lib/auth'

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const account = await currentAccount()
  if (account) redirect('/' + account.role)
  return <RegisterForm error={(await searchParams).error} />
}
