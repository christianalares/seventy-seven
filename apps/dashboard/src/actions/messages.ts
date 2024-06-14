'use server'

import { analyticsClient } from '@/lib/analytics'
import { authAction } from '@/lib/safe-action'
import { usersQueries } from '@/queries/users'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import TicketMessageResponse from '@seventy-seven/email/emails/ticket-message-response'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const createMessage = authAction(
  z.object({
    ticketId: z.string().uuid(),
    body: z.string().min(1).max(1000),
  }),
  async (values, user) => {
    const dbUser = await usersQueries.findMe()

    const usersTeamsHasThisTicket = dbUser.teams.some((team) =>
      team.team.tickets.some((ticket) => ticket.id === values.ticketId),
    )

    if (!usersTeamsHasThisTicket) {
      throw new Error('No ticket found')
    }

    const createdMessage = await prisma.message.create({
      data: {
        ticket_id: values.ticketId,
        body: values.body,
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
        await prisma.message.update({
          where: { id: createdMessage.id },
          data: {
            email_id: data.id,
          },
        })
      }
    }

    revalidatePath(`/inbox/${createdMessage.ticket.id}`)

    analyticsClient.event('message_created', {
      team_id: createdMessage.ticket.team.id,
      ticket_id: createdMessage.ticket.id,
      profileId: user.id,
    })

    return createdMessage
  },
)

export const editMessage = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    messageId: z.string().uuid(),
    body: z
      .string()
      .min(1, { message: 'A message body is required' })
      .max(1000, { message: 'Message cannot be longer than 1000 characters' }),
  }),
  async (values, user) => {
    const updatedMessage = await prisma.message.update({
      where: {
        id: values.messageId,
        // Make sure the user is a member of the team that the ticket belongs to
        ticket: {
          team: {
            members: {
              some: {
                user_id: user.id,
              },
            },
          },
        },
      },
      data: {
        body: values.body,
        unable_to_parse_content: false,
      },
      select: {
        id: true,
      },
    })

    if (!updatedMessage) {
      throw new Error('Failde to update message')
    }

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('message_edited', {
      message_id: updatedMessage.id,
    })

    return updatedMessage
  },
)
