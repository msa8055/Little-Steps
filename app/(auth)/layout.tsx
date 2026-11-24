import { Logo } from '@/components/ls/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 md:px-10">
        <Logo />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</main>
      </div>
      <aside className="relative hidden flex-col justify-end overflow-hidden bg-secondary p-10 lg:flex">
        <img src="/images/hero.png" alt="" className="absolute inset-0 size-full object-cover opacity-90" />
        <div className="relative rounded-3xl bg-card/90 p-6 backdrop-blur">
          <p className="font-heading text-2xl font-semibold text-balance">&ldquo;Every big journey starts with a little step.&rdquo;</p>
          <p className="mt-2 text-sm text-muted-foreground">Build life skills, confidence and kindness.</p>
        </div>
      </aside>
    </div>
  )
}
