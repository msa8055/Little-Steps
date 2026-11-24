'use client'

import { CheckCircle2, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Btn, Card, Field, Input, Select, Textarea } from '@/components/ls/ui'

import { uid, useStore } from '@/lib/store'

export function ContactForm() {
  const { set, hydrated } = useStore()
  const [form, setForm] = useState({ name: '', email: '', topic: 'Families', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (form.name.trim().length < 2) err.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Please enter a valid email.'
    if (form.message.trim().length < 10) err.message = 'Message should be at least 10 characters.'
    setErrors(err)
    if (Object.keys(err).length) return
    if (!hydrated) return
    const request = { id: uid(), name: form.name.trim(), email: form.email.trim(), topic: form.topic, message: form.message.trim(), resolved: false }
    set((state) => ({ workspace: { ...state.workspace, support: [request, ...state.workspace.support] } }))
    setSent(true)
    toast.success('Support draft saved on this device')
  }
  if (sent)
    return (
      <Card className="flex flex-col items-center justify-center gap-3 text-center">
        <CheckCircle2 className="size-12 text-mint" aria-hidden />
        <h2 className="text-2xl font-semibold">Thanks, {form.name.split(' ')[0]}!</h2>
        <p className="text-muted-foreground">Your draft is saved in this browser.</p>
        <Btn variant="outline" onClick={() => { setSent(false); setForm({ name: '', email: '', topic: 'Families', message: '' }) }}>
          Add another request
        </Btn>
      </Card>
    )
  return (
    <Card>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="Your name" error={errors.name}>{(id) => <Input id={id} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}</Field>
        <Field label="Email" error={errors.email}>{(id) => <Input id={id} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}</Field>
        <Field label="Topic">
          {(id) => (
            <Select id={id} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
              {['Families', 'Schools', 'Becoming a mentor', 'Safety concern', 'Something else'].map((t) => <option key={t}>{t}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Message" error={errors.message}>{(id) => <Textarea id={id} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />}</Field>
        <Btn type="submit" size="lg" disabled={!hydrated}>
          <Send /> Save support draft
        </Btn>
      </form>
    </Card>
  )
}


