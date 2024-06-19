import { integrationsQueries } from './integrations'
import { teamsQueries } from './teams'
import { ticketsQueries } from './tickets'
import { usersQueries } from './users'

function createQueryIds<T extends Record<string, any>>(input: T): { [K in keyof T]: K } {
  const resultObj = {} as { [K in keyof T]: K }
  ;(Object.keys(input) as Array<keyof T>).forEach((key) => {
    resultObj[key] = key
  })

  return resultObj
}

const integrationsIds = createQueryIds(integrationsQueries)
const teamsIds = createQueryIds(teamsQueries)
const ticketsIds = createQueryIds(ticketsQueries)
const usersIds = createQueryIds(usersQueries)

export const api = {
  integrations: {
    queries: integrationsQueries,
    ids: integrationsIds,
  },
  teams: {
    queries: teamsQueries,
    ids: teamsIds,
  },
  tickets: {
    queries: ticketsQueries,
    ids: ticketsIds,
  },
  users: {
    queries: usersQueries,
    ids: usersIds,
  },
}
