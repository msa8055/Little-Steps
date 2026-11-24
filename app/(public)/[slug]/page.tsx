import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ContactForm } from '@/components/public/contact-form'
import { Cta, Faq, HowItWorks, Modules, Roles, SectionHead, Testimonials } from '@/components/public/sections'

const prose: Record<string, { title: string; eyebrow: string; intro: string; blocks: { h: string; p: string }[] }> = {
  about: {
    title: 'About LittleSteps', eyebrow: 'Our story',
    intro: 'LittleSteps began when a group of teachers, parents and counsellors noticed the same gap: children were acing exams but struggling with everyday life — speaking up, handling money, staying safe online and understanding their feelings.',
    blocks: [
      { h: 'Who we are', p: 'A small team of educators, child psychologists, designers and engineers who believe life skills should be as joyful to learn as a favourite game.' },
      { h: 'What we do', p: 'We turn research-backed life-skills curricula into ten-minute lessons, interactive simulators and real-world challenges that families can do together.' },
      { h: 'How we keep it safe', p: 'Every mentor is verified, every community post is moderated, and parents can always see what their child is doing.' },
    ],
  },
  mission: {
    title: 'Our Mission', eyebrow: 'Why we exist',
    intro: 'To help every child aged 10–18 build the confidence, character and practical skills to navigate life — one little step at a time.',
    blocks: [
      { h: 'Practical over theoretical', p: 'Every lesson ends with something you can try today: a conversation, a budget, a breathing exercise.' },
      { h: 'Families learn together', p: 'Parents are partners, not spectators. Shared challenges and reports start better conversations at home.' },
      { h: 'Progress you can feel', p: 'Streaks, badges and a Growth Map make invisible skills visible, so effort is always recognised.' },
    ],
  },
  vision: {
    title: 'Our Vision', eyebrow: 'Where we are heading',
    intro: 'A generation of young people who are kind, curious, financially aware, digitally safe and confident about their future.',
    blocks: [
      { h: 'Every school, every home', p: 'We imagine LittleSteps used in classrooms and kitchens alike, connecting what kids learn with how they live.' },
      { h: 'Mentors for all', p: 'Access to great mentors should not depend on who your parents know. We are building a network open to everyone.' },
      { h: 'Skills for a changing world', p: 'From AI literacy to climate careers, our curriculum grows as the world does.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy', eyebrow: 'Last updated 1 November 2026',
    intro: 'We take children\u2019s privacy seriously. This summary explains what we collect, why, and the choices you have.',
    blocks: [
      { h: 'What we collect', p: 'Account details (name, age group, email of a parent or guardian), learning progress, and content you choose to upload such as journal entries or artwork.' },
      { h: 'How we use it', p: 'Only to provide and personalise learning, generate reports for linked parents, and keep the community safe. We never sell personal data or show third-party ads.' },
      { h: 'Your controls', p: 'Profiles are private by default. Parents can download or delete their child\u2019s data at any time from Settings.' },
      { h: 'This prototype', p: 'The server stores registration details and sign-in sessions. Learning records are stored in this browser.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions', eyebrow: 'Last updated 1 November 2026',
    intro: 'By using LittleSteps you agree to these simple, family-friendly terms.',
    blocks: [
      { h: 'Be kind', p: 'No bullying, hate, or sharing of personal information. Moderators may remove content or suspend accounts that break community rules.' },
      { h: 'Parental consent', p: 'Users under 13 need a parent or guardian to create or link their account.' },
      { h: 'Rewards', p: 'Coins and badges have no cash value. Real-world rewards are offered and approved by parents.' },
      { h: 'Mentoring', p: 'Mentors are independent professionals verified by our team. Sessions are recorded in summary notes for safety.' },
    ],
  },
}

const titles: Record<string, string> = { features: 'Features', 'how-it-works': 'How it works', contact: 'Contact us', faq: 'FAQ', testimonials: 'Stories' }
const all = [...Object.keys(prose), ...Object.keys(titles)]

export function generateStaticParams() {
  return all.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${prose[slug]?.title ?? titles[slug] ?? 'Page'} – LittleSteps` }
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!all.includes(slug)) notFound()

  if (slug === 'features')
    return (
      <>
        <Modules />
        <Roles />
        <Cta />
      </>
    )
  if (slug === 'how-it-works')
    return (
      <>
        <HowItWorks />
        <Modules />
        <Cta />
      </>
    )
  if (slug === 'faq')
    return (
      <>
        <Faq />
        <Cta />
      </>
    )
  if (slug === 'testimonials')
    return (
      <>
        <Testimonials />
        <Cta />
      </>
    )
  if (slug === 'contact')
    return (
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="flex flex-col gap-6">
          <SectionHead eyebrow="Contact" title="We'd love to hear from you" body="Save a support draft in this browser." center={false} />
        </div>
        <ContactForm />
      </section>
    )

  const p = prose[slug]
  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">{p.eyebrow}</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold md:text-5xl">{p.title}</h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{p.intro}</p>
        <div className="mt-10 flex flex-col gap-6">
          {p.blocks.map((b) => (
            <section key={b.h} className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">{b.h}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{b.p}</p>
            </section>
          ))}
        </div>
      </article>
      <Cta />
    </>
  )
}


