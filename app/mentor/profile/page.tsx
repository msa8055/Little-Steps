import { requireAccount } from '@/lib/auth'
import { updateSpecialty } from '@/lib/family-actions'
import { getSpecialty } from '@/lib/family-db'
import { specialties } from '@/lib/specialties'
import { Btn, Card, PageHeader, Select } from '@/components/ls/ui'

export default async function MentorProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const account = await requireAccount('mentor')
  const current = getSpecialty(account)
  const { saved } = await searchParams
  return <div className="space-y-4">
    <PageHeader title="Mentor profile" />
    <Card className="space-y-3">
      <p className="font-semibold">{account.name}</p>
      {saved && <p role="status">Specialty saved.</p>}
      <form action={updateSpecialty} className="space-y-3">
        <label className="block space-y-2"><span className="block font-medium">What do you teach?</span>
          <Select name="specialty" defaultValue={current} required>
            <option value="">Choose a specialty</option>
            {specialties.map(item => <option key={item}>{item}</option>)}
          </Select>
        </label>
        <Btn type="submit">Save specialty</Btn>
      </form>
    </Card>
  </div>
}
