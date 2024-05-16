import { createSearchParamsCache, parseAsArrayOf, parseAsString, parseAsStringEnum } from 'nuqs/server'

// TICKET FILTERS
export const statuses = ['unhandled', 'snoozed', 'starred', 'closed'] as const
export type Status = (typeof statuses)[number]

export const ticketFiltersParsers = {
  q: parseAsString,
  statuses: parseAsArrayOf(parseAsStringEnum<Status>([...statuses])),
  assignees: parseAsArrayOf(parseAsString),
}

export const ticketFiltersCache = createSearchParamsCache(ticketFiltersParsers)

// TICKET ID
export const ticketIdParsers = {
  ticketId: parseAsString,
}

export const ticketIdCache = createSearchParamsCache(ticketIdParsers)
