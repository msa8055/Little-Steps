import { PeoplePage } from '@/components/ls/connections-page'
import type { ComponentProps } from 'react'

export default function FindMentorPage({ searchParams }: Pick<ComponentProps<typeof PeoplePage>, 'searchParams'>) {
  return <PeoplePage searchParams={searchParams} mentorsOnly />
}
