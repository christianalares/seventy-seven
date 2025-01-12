import type { inferRouterOutputs } from '@trpc/server'
import { createTRPCRouter } from '../init'
import { teamsRouter } from './teams-router'
import { ticketsRouter } from './tickers-router'
import { usersRouter } from './users-router'

export const appRouter = createTRPCRouter({
  users: usersRouter,
  teams: teamsRouter,
  tickets: ticketsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

export type RouterOutputs = inferRouterOutputs<AppRouter>
