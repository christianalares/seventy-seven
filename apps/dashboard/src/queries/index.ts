import { integrationsQueries } from './integrations'
import { teamsQueries } from './teams'
import { ticketsQueries } from './tickets'
import { usersQueries } from './users'

export const api = {
  integrations: {
    queries: integrationsQueries,
  },
  teams: {
    queries: teamsQueries,
  },
  tickets: {
    queries: ticketsQueries,
  },
  users: {
    queries: usersQueries,
  },
}
