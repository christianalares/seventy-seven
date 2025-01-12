import { TRPCError } from '@trpc/server'
import { authProcedure, baseProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace UsersRouter {
  export type GetMaybeMe = RouterOutputs['users']['maybeMe']
  export type GetMe = RouterOutputs['users']['me']
}

export const usersRouter = createTRPCRouter({
  maybeMe: baseProcedure.query(async ({ ctx }) => {
    const me = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user?.id,
      },
    })

    return me
  }),
  me: authProcedure.query(async ({ ctx }) => {
    const me = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        current_team: {
          select: {
            id: true,
            name: true,
            image_url: true,
            ticket_tags: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        teams: {
          select: {
            role: true,
            team: {
              select: {
                id: true,
                name: true,
                image_url: true,
                tickets: {
                  select: {
                    id: true,
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!me) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    return me
  }),
})
