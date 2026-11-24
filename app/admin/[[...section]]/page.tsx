import { notFound } from 'next/navigation'
import { RoleWorkspace } from '@/components/ls/role-workspace'
import { navByRole } from '@/lib/nav'

export default async function Page({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params
  const href = ['/admin', ...section].join('/')
  if (!navByRole.admin.some((group) => group.items.some((item) => item.href === href))) notFound()
  return <RoleWorkspace role="admin" section={section[0] ?? ''} />
}
