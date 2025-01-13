import type { inferRouterOutputs } from '@trpc/server'
import { createTRPCRouter } from '../init'
import { integrationsRouter } from './integrations-router'
import { invitesRouter } from './invites-router'
import { messagesRouter } from './messages-router'
import { teamsRouter } from './teams-router'
import { ticketsRouter } from './tickets-router'
import { ticketTagsRouter } from './tickets-tags-router'
import { usersRouter } from './users-router'

export const appRouter = createTRPCRouter({
  users: usersRouter,
  teams: teamsRouter,
  tickets: ticketsRouter,
  messages: messagesRouter,
  integrations: integrationsRouter,
  ticketTags: ticketTagsRouter,
  invites: invitesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

export type RouterOutputs = inferRouterOutputs<AppRouter>
