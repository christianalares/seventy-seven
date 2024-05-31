import { ticketFiltersParsers } from '@/lib/search-params'
import { useQueryStates } from 'nuqs'

const statuses = ['unhandled', 'snoozed', 'starred', 'closed'] as const
export type Status = (typeof statuses)[number]

export const useTicketFilters = () => {
  const [filter, setFilter] = useQueryStates(ticketFiltersParsers, {
    shallow: false,
  })

  const hasFilters = Object.entries(filter)
    .filter(([key]) => ['statuses', 'assignees', 'tags'].includes(key))
    .some(([_key, value]) => value !== null)

  const clearFilters = () => {
    setFilter({
      assignees: null,
      statuses: null,
      tags: null,
    })
  }

  return { filter, setFilter, clearFilters, hasFilters }
}
