import { ticketFiltersParsers } from '@/lib/search-params'
import { useQueryStates } from 'nuqs'

const statuses = ['unhandled', 'snoozed', 'starred', 'closed'] as const
export type Status = (typeof statuses)[number]

export const useTicketFilters = () => {
  const [filter, setFilter] = useQueryStates(ticketFiltersParsers, {
    shallow: false,
  })

  const hasFilters = Object.values(filter).some((value) => value !== null)

  return { filter, setFilter, hasFilters }
}
