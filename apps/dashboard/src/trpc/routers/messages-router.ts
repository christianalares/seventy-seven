import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import TicketMessageResponse from '@seventy-seven/email/emails/ticket-message-response'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authProcedure, createTRPCRouter } from '../init'
import type { RouterOutputs } from './_app'

export namespace MessagesRouter {
  export type FindMany = RouterOutputs['messages']['create']
}

export const messagesRouter = createTRPCRouter({
  create: authProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        body: z.string().min(1).max(1000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          id: true,
          teams: {
            select: {
              team: {
                select: {
                  tickets: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      const usersTeamsHasThisTicket = user.teams.some((team) =>
        team.team.tickets.some((ticket) => ticket.id === input.ticketId),
      )

      if (!usersTeamsHasThisTicket) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No ticket found' })
      }

      const createdMessage = await ctx.prisma.message.create({
        data: {
          ticket_id: input.ticketId,
          body: input.body,
          handler_id: user.id,
        },
        select: {
          id: true,
          created_at: true,
          body: true,
          handler: {
            select: {
              full_name: true,
              image_url: true,
            },
          },
          ticket: {
            select: {
              id: true,
              short_id: true,
              subject: true,

              team: {
                select: {
                  id: true,
                  name: true,
                  image_url: true,
                  is_personal: true,
                },
              },
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
                orderBy: {
                  created_at: 'desc',
                },
              },
            },
          },
        },
      })

      if (createdMessage.handler) {
        // Send email to the user that created the ticket
        const thread = createdMessage.ticket.messages
        const resend = createResendClient()

        const template = TicketMessageResponse({
          handler: {
            name: createdMessage.handler.full_name,
            avatar: createdMessage.handler.image_url ?? undefined,
            company: {
              name: createdMessage.ticket.team.name,
              image_url: createdMessage.ticket.team.image_url ?? undefined,
            },
          },
          thread,
        })

        const lastMessageFromUser = thread.find((message) => !!message.sent_from_email)

        if (!lastMessageFromUser || !lastMessageFromUser.sent_from_email) {
          throw new Error('No last message from user found')
        }

        // If the team is personal or if the handlers name is the same as the team name, then the `from` field should be the handlers name
        // otherwise show [name] from [team_name]
        const from =
          createdMessage.handler.full_name === createdMessage.ticket.team.name
            ? createdMessage.handler.full_name
            : `${createdMessage.handler.full_name} from ${createdMessage.ticket.team.name}`

        const { data, error } = await resend.emails.send({
          from: `${from} <seventy-seven@seventy-seven.dev>`,
          reply_to: `${from} <${createdMessage.ticket.short_id}@ticket.seventy-seven.dev>`,
          to: [lastMessageFromUser.sent_from_email],
          subject: `Re: ${createdMessage.ticket.subject} (#${createdMessage.ticket.short_id})`,
          react: template,
          text: componentToPlainText(template),
          tags: [
            { name: 'message_id', value: createdMessage.id },
            { name: 'ticket_id', value: createdMessage.ticket.id },
          ],
        })

        if (error) {
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log(`Error sending email to ${lastMessageFromUser.sent_from_email}`, error)
        }

        if (data) {
          await ctx.prisma.message.update({
            where: { id: createdMessage.id },
            data: {
              email_id: data.id,
            },
          })
        }
      }

      ctx.analyticsClient.event('message_created', {
        team_id: createdMessage.ticket.team.id,
        ticket_id: createdMessage.ticket.id,
        profileId: user.id,
      })

      return createdMessage
    }),
  edit: authProcedure
    .input(
      z.object({
        messageId: z.string().uuid(),
        body: z
          .string()
          .min(1, { message: 'A message body is required' })
          .max(1000, { message: 'Message cannot be longer than 1000 characters' }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedMessage = await ctx.prisma.message
        .update({
          where: {
            id: input.messageId,
            // Make sure the user is a member of the team that the ticket belongs to
            ticket: {
              team: {
                members: {
                  some: {
                    user_id: ctx.user.id,
                  },
                },
              },
            },
          },
          data: {
            body: input.body,
            unable_to_parse_content: false,
          },
          select: {
            id: true,
          },
        })
        .catch(() => {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update message' })
        })

      ctx.analyticsClient.event('message_edited', {
        message_id: updatedMessage.id,
        profileId: ctx.user.id,
      })

      return updatedMessage
    }),
})
