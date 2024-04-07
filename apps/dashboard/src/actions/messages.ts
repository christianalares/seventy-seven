'use server'

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
            sender_email: true,
            sender_full_name: true,
            sender_avatar_url: true,

            team: {
              select: {
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
      const resend = createResendClient()

      const thread = createdMessage.ticket.messages

      const template = TicketMessageResponse({
        handler: {
          name: createdMessage.handler.full_name,
          avatar: createdMessage.handler.image_url ?? undefined,
          company: {
            name: createdMessage.ticket.team.name,
            image_url: createdMessage.ticket.team.image_url ?? undefined,
          },
        },
        user: {
          name: createdMessage.ticket.sender_full_name,
          avatar: createdMessage.ticket.sender_avatar_url ?? undefined,
        },
        thread,
      })

      // If the team is personal or if the handlers name is the same as the team name, then the `from` field should be the handlers name
      // otherwise show [name] from [team_name]
      const from =
        createdMessage.handler.full_name === createdMessage.ticket.team.name
          ? createdMessage.handler.full_name
          : `${createdMessage.handler.full_name} from ${createdMessage.ticket.team.name}`

      const { data, error } = await resend.emails.send({
        from: `${from} <seventy-seven@seventy-seven.dev>`,
        reply_to: `${from} <${createdMessage.ticket.short_id}@ticket.seventy-seven.dev>`,
        to: [createdMessage.ticket.sender_email],
        subject: `Re: ${createdMessage.ticket.subject}`,
        react: template,
        text: componentToPlainText(template),
        tags: [
          { name: 'message_id', value: createdMessage.id },
          { name: 'ticket_id', value: createdMessage.ticket.id },
        ],
      })

      if (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Error sending email to ${createdMessage.ticket.sender_email}`, error)
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

    return createdMessage
  },
)
