import { notFound, redirect } from 'next/navigation'
import { RoleWorkspace } from '@/components/ls/role-workspace'
import { navByRole } from '@/lib/nav'

export default async function Page({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params
  if (!section.length || ['rewards', 'calendar'].includes(section.join('/'))) redirect('/parent/learning')
  const href = ['/parent', ...section].join('/')
  if (!navByRole.parent.some((group) => group.items.some((item) => item.href === href))) notFound()
  return <RoleWorkspace role="parent" section={section[0] ?? ''} />
}
