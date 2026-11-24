import { SiteFooter, SiteNav } from '@/components/public/site-chrome'
import { LittleBot } from '@/components/ls/littlebot'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
      <LittleBot />
    </>
  )
}
