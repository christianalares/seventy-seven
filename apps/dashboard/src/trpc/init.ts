import { analyticsClient } from '@/lib/analytics'
import { prisma } from '@seventy-seven/orm/prisma'
import { getUser } from '@seventy-seven/supabase/session'
import { TRPCError, initTRPC } from '@trpc/server'
import { cache } from 'react'
import superjson from 'superjson'

export const createTRPCContext = cache(async () => {
  const user = await getUser()

  return {
    prisma,
    user,
    analyticsClient,
  }
})

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
})

export const createCallerFactory = t.createCallerFactory

export const createTRPCRouter = t.router

export const baseProcedure = t.procedure

export const authProcedure = t.procedure.use(async (opts) => {
  const { user } = opts.ctx

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user,
    },
  })
})
