import { Prisma } from '@seventy-seven/orm/prisma'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace TicketsRouter {
  export type FindMany = RouterOutputs['tickets']['findMany']
}

export const ticketsRouter = createTRPCRouter({
  findMany: authProcedure
    .input(
      z.object({
        statuses: z.array(z.enum(['unhandled', 'snoozed', 'starred', 'closed'])).optional(),
        memberIds: z.array(z.string().uuid()).optional(),
        tags: z.array(z.string()).optional(),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const memberIds = input.memberIds ?? []
      const statuses = input.statuses ?? []
      const tags = input.tags ?? []
      const query = input.query ?? ''

      const SELECT = {
        id: true,
        created_at: true,
        subject: true,
        snoozed_until: true,
        starred_at: true,
        closed_at: true,
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
          orderBy: {
            created_at: 'asc',
          },
        },
        assigned_to_user: {
          select: {
            id: true,
            full_name: true,
            image_url: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            created_at: 'desc',
          },
          select: {
            created_at: true,
            sent_from_full_name: true,
            sent_from_email: true,
            sent_from_avatar_url: true,
            body: true,
            handler: {
              select: {
                id: true,
                full_name: true,
                image_url: true,
              },
            },
          },
        },
      } satisfies Prisma.TicketSelect

      const AND: Prisma.TicketWhereInput['AND'] =
        memberIds.length === 0
          ? undefined
          : [...(memberIds.length > 0 ? [{ assigned_to_user_id: { in: memberIds } }] : [])]

      const OR: Prisma.TicketWhereInput['OR'] =
        statuses.length === 0 && tags.length === 0 && !query
          ? undefined
          : [
              ...(statuses.includes('unhandled') ? [{ closed_at: null }] : []),
              ...(statuses.includes('starred') ? [{ starred_at: { not: null } }] : []),
              ...(statuses.includes('snoozed') ? [{ snoozed_until: { not: null } }] : []),
              ...(statuses.includes('closed') ? [{ closed_at: { not: null } }] : []),
              ...(tags.length > 0
                ? [
                    {
                      tags: {
                        some: {
                          tag: {
                            id: {
                              in: tags,
                            },
                          },
                        },
                      },
                    },
                  ]
                : []),
              ...(query.length > 0
                ? [
                    {
                      subject: {
                        contains: query,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },

                    {
                      messages: {
                        some: {
                          body: {
                            contains: query,
                            mode: Prisma.QueryMode.insensitive,
                          },
                        },
                      },
                    },
                  ]
                : []),
            ]

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          current_team_id: true,
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const tickets = await ctx.prisma.ticket.findMany({
        where: {
          team_id: user.current_team_id,
          AND,
          OR,
        },
        select: SELECT,
        orderBy: { created_at: 'desc' },
      })

      // "Unhandled" tickets are those where the last message was sent by a customer and not a team member.
      // Think of it as "unread" or "not responded to"
      const ticketsWithHandledStatus = tickets.map((ticket) => {
        const lastMessage = ticket.messages.at(-1)
        const isUnhandled = !lastMessage?.handler

        return {
          ...ticket,
          isUnhandled,
        }
      })

      if (statuses.length > 0 && statuses.includes('unhandled')) {
        return ticketsWithHandledStatus.filter((ticket) => ticket.isUnhandled)
      }

      return ticketsWithHandledStatus
    }),
})
