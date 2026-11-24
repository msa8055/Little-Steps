import { requireAccount } from '@/lib/auth'
import { AppShell } from '@/components/ls/shell'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAccount('child')
  return <AppShell role="child">{children}</AppShell>
}
