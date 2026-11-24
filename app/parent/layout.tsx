import { requireAccount } from '@/lib/auth'
import { AppShell } from '@/components/ls/shell'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAccount('parent')
  return <AppShell role="parent">{children}</AppShell>
}
