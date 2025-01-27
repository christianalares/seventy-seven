import { unsnoozeTicketTask } from '@/trigger/unsnooze-ticket'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import TicketClosed from '@seventy-seven/email/emails/ticket-closed'
import { Prisma } from '@seventy-seven/orm/prisma'
import { runs } from '@trigger.dev/sdk/v3'
import { TRPCError } from '@trpc/server'
import { isFuture } from 'date-fns'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace TicketsRouter {
  export type FindMany = RouterOutputs['tickets']['findMany']
  export type FindById = RouterOutputs['tickets']['findById']
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
  findById: authProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const ticket = await ctx.prisma.ticket.findFirst({
        where: {
          // Make sure the ticket belongs to the user's team
          team: {
            id: user.current_team_id,
            members: {
              some: {
                user_id: user.id,
              },
            },
          },
          id: input.id,
        },
        select: {
          id: true,
          subject: true,
          starred_at: true,
          closed_at: true,
          snoozed_until: true,
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
          team: {
            select: {
              members: {
                select: {
                  user: {
                    select: {
                      id: true,
                      full_name: true,
                      image_url: true,
                    },
                  },
                },
              },
            },
          },
          messages: {
            select: {
              created_at: true,
              id: true,
              unable_to_parse_content: true,
              handler: {
                select: {
                  id: true,
                  full_name: true,
                  image_url: true,
                },
              },
              sent_from_full_name: true,
              sent_from_email: true,
              sent_from_avatar_url: true,
              body: true,
            },
            orderBy: {
              created_at: 'asc',
            },
          },
        },
      })

      if (!ticket) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Ticket not found' })
      }

      return ticket
    }),
  toggleStar: authProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        star: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedTicket = await ctx.prisma.ticket
        .update({
          where: {
            id: input.ticketId,
            // Make sure the user is a member of the team
            team: {
              members: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
          },
          data: {
            starred_at: input.star ? new Date() : null,
          },
          select: {
            id: true,
            starred_at: true,
          },
        })
        .catch((error) => {
          console.error(error)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to ${input.star ? 'star' : 'unstar'} ticket, something went wrong 😢`,
          })
        })

      if (!updatedTicket) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to ${input.star ? 'star' : 'unstar'} ticket, something went wrong 😢`,
        })
      }

      if (input.star) {
        ctx.analyticsClient.event('starred_ticket', {
          ticket_id: updatedTicket.id,
          profileId: ctx.user.id,
        })
      } else {
        ctx.analyticsClient.event('unstarred_ticket', {
          ticket_id: updatedTicket.id,
          profileId: ctx.user.id,
        })
      }

      return {
        ...updatedTicket,
        wasStarred: !!updatedTicket.starred_at,
      }
    }),
  closeTicket: authProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedTicket = await ctx.prisma.ticket
        .update({
          where: {
            id: input.ticketId,
            // Make sure the user is a member of the team
            team: {
              members: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
          },
          data: {
            closed_at: new Date(),
          },
          select: {
            id: true,
            short_id: true,
            starred_at: true,
            messages: {
              select: {
                id: true,
                body: true,
                created_at: true,
                sent_from_full_name: true,
                sent_from_email: true,
                sent_from_avatar_url: true,
                handler: {
                  select: {
                    full_name: true,
                    image_url: true,
                  },
                },
              },
            },
          },
        })
        .catch((error) => {
          console.error(error)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to close ticket, something went wrong 😢',
          })
        })

      if (!updatedTicket) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to close ticket, something went wrong 😢',
        })
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          full_name: true,
          image_url: true,
          current_team: {
            select: {
              name: true,
              image_url: true,
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const resend = createResendClient()

      // Construct an array of `Name <email>`
      const recipients = updatedTicket.messages
        .map((msg) => ({ name: msg.sent_from_full_name, email: msg.sent_from_email }))
        .filter((r): r is { name: string; email: string } => !!r.email && !!r.name)
        .map((r) => `${r.name} <${r.email}>`)

      const uniqueRecipients = [...new Set(recipients)]

      // If the team is personal or if the handlers name is the same as the team name, then the `from` field should be the handlers name
      // otherwise show [name] from [team_name]
      const from =
        user.full_name === user.current_team.name ? user.full_name : `${user.full_name} from ${user.current_team.name}`

      const template = TicketClosed({
        handler: {
          company: {
            name: user.current_team.name,
            image_url: user.current_team.image_url ?? undefined,
          },
          name: user.full_name,
          avatar: user.image_url ?? undefined,
        },
        thread: updatedTicket.messages,
        ticket: {
          id: updatedTicket.id,
          short_id: updatedTicket.short_id,
        },
      })

      const { error } = await resend.emails.send({
        from: `${from} <seventy-seven@seventy-seven.dev>`,
        reply_to: `${from} <${updatedTicket.short_id}@ticket.seventy-seven.dev>`,
        to: uniqueRecipients,
        subject: `Ticket #${updatedTicket.short_id} was closed`,
        react: template,
        text: componentToPlainText(template),
      })

      if (error) {
        console.error('Error sending email', error)
      }

      ctx.analyticsClient.event('closed_ticket', {
        ticket_id: updatedTicket.id,
        profileId: ctx.user.id,
      })

      return updatedTicket
    }),
  assign: authProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        memberId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const ticket = await ctx.prisma.ticket
        .findUnique({
          where: {
            id: input.ticketId,
          },
          select: {
            team: {
              select: {
                members: {
                  select: {
                    user_id: true,
                  },
                },
              },
            },
          },
        })
        .catch((error) => {
          console.error(error)

          throw new TRPCError({ code: 'NOT_FOUND', message: 'Ticket not found' })
        })

      if (!ticket) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Ticket not found' })
      }

      const memberIdsInTeam = ticket.team.members.map((m) => m.user_id)

      if (![ctx.user.id, input.memberId].every((id) => memberIdsInTeam.includes(id))) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot assign a ticket to a member that is not in the team',
        })
      }

      const updatedTicket = await ctx.prisma.ticket.update({
        where: {
          id: input.ticketId,
        },
        data: {
          assigned_to_user_id: input.memberId,
        },
        select: {
          assigned_to_user: {
            select: {
              full_name: true,
            },
          },
        },
      })

      ctx.analyticsClient.event('assigned_ticket', {
        ticket_id: input.ticketId,
        profileId: ctx.user.id,
        assigned_to_user_id: input.memberId,
      })

      return updatedTicket
    }),
  unassign: authProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.ticket
        .update({
          where: {
            id: input.ticketId,
            team: {
              members: {
                some: {
                  user_id: ctx.user.id,
                },
              },
            },
          },
          data: {
            assigned_to_user_id: null,
          },
        })
        .catch((_err) => {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to unassign ticket' })
        })

      ctx.analyticsClient.event('unassigned_ticket', {
        ticket_id: input.ticketId,
        profileId: ctx.user.id,
      })

      return { success: true }
    }),
  snooze: authProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        snoozedUntil: z
          .date({ required_error: 'Snoozed date is required' })
          .refine(isFuture, { message: 'Snoozed date must be in the future' }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          email: true,
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const updatedTicket = await ctx.prisma.ticket.update({
        where: {
          id: input.ticketId,
          // Make sure the user is a member of the team
          team: {
            members: {
              some: {
                user_id: ctx.user.id,
              },
            },
          },
        },
        data: {
          snoozed_until: input.snoozedUntil,
        },
        select: {
          snoozed_until: true,
          id: true,
          event_id: true,
        },
      })

      if (!updatedTicket.snoozed_until) {
        throw new Error('Failed to snooze ticket, something went wrong 😢')
      }

      // If a user snoozes a ticket when it's already snoozed, we need to cancel the previous event
      if (updatedTicket.event_id) {
        await runs.cancel(updatedTicket.event_id)
      }

      const event = await unsnoozeTicketTask.trigger(
        {
          ticketId: updatedTicket.id,
          userId: ctx.user.id,
          userEmail: user.email,
        },
        {
          delay: updatedTicket.snoozed_until,
        },
      )

      // Update the ticket with the event id
      await ctx.prisma.ticket.update({
        where: { id: updatedTicket.id },
        data: {
          event_id: event.id,
        },
      })

      if (!updatedTicket) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to snooze ticket, something went wrong 😢',
        })
      }

      ctx.analyticsClient.event('snoozed_ticket', {
        ticket_id: updatedTicket.id,
        profileId: ctx.user.id,
      })

      return updatedTicket
    }),
})
