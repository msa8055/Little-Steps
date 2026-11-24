import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { currentAccount } from '@/lib/auth'
import { StoreProvider } from '@/lib/store'
import './globals.css'

export const metadata: Metadata = {
  title: 'LittleSteps – Life Skills & Personal Development for Ages 10–18',
  description:
    'Every Big Journey Starts With a Little Step. Life skills, digital safety, money, wellbeing, careers and creativity for children aged 10–18.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f6fd' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1628' },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = await currentAccount()
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="antialiased">
        <StoreProvider key={account?.id ?? 'guest'} account={account}>{children}</StoreProvider>
        <Toaster position="top-center" richColors closeButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
