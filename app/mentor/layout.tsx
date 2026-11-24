import { requireAccount } from '@/lib/auth'
import { AppShell } from '@/components/ls/shell'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAccount('mentor')
  return <AppShell role="mentor">{children}</AppShell>
}
