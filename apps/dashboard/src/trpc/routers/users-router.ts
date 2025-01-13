import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authProcedure, baseProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace UsersRouter {
  export type GetMaybeMe = RouterOutputs['users']['maybeMe']
  export type GetMe = RouterOutputs['users']['me']
}

export const usersRouter = createTRPCRouter({
  maybeMe: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      return null
    }

    const me = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
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
  myCurrentTeam: authProcedure.query(async ({ ctx }) => {
    const usersCurrentTeam = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        id: true,
        current_team: {
          select: {
            id: true,
            name: true,
            image_url: true,
            auth_token: true,
            ticket_tags: {
              select: {
                id: true,
                name: true,
                color: true,
              },
              orderBy: {
                created_at: 'asc',
              },
            },
            members: {
              select: {
                role: true,
                user: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true,
                    image_url: true,
                  },
                },
              },
              orderBy: {
                created_at: 'asc',
              },
            },
          },
        },
      },
    })

    if (!usersCurrentTeam) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    return usersCurrentTeam
  }),
  updateDisplayName: authProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          full_name: input.displayName,
        },
        select: {
          full_name: true,
        },
      })

      return updatedUser
    }),
  updateEmailNotifications: authProcedure
    .input(
      z.object({
        type: z.enum(['new_ticket', 'new_messages']),
        value: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.type === 'new_ticket') {
        const updatedUser = await ctx.prisma.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            notification_email_new_ticket: input.value,
          },
          select: {
            notification_email_new_ticket: true,
            notification_email_new_message: true,
          },
        })

        return updatedUser
      }

      if (input.type === 'new_messages') {
        const updatedUser = await ctx.prisma.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            notification_email_new_message: input.value,
          },
          select: {
            notification_email_new_ticket: true,
            notification_email_new_message: true,
          },
        })

        return updatedUser
      }
    }),
})
