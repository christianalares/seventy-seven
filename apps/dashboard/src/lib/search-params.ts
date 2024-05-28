import { createSearchParamsCache, parseAsArrayOf, parseAsString, parseAsStringLiteral } from 'nuqs/server'

// TICKET FILTERS
export const statuses = ['unhandled', 'snoozed', 'starred', 'closed'] as const
export type Status = (typeof statuses)[number]

export const ticketFiltersParsers = {
  q: parseAsString,
  statuses: parseAsArrayOf(parseAsStringLiteral(statuses)),
  assignees: parseAsArrayOf(parseAsString),
}

export const ticketFiltersCache = createSearchParamsCache(ticketFiltersParsers)

// TICKET ID
export const ticketIdParsers = {
  ticketId: parseAsString,
}

export const ticketIdCache = createSearchParamsCache(ticketIdParsers)
