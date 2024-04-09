import { createSearchParamsCache, parseAsStringEnum } from 'nuqs/server'

export const searchParamsCache = createSearchParamsCache({
  folder: parseAsStringEnum(['snoozed', 'drafts', 'responded', 'closed']),
})
