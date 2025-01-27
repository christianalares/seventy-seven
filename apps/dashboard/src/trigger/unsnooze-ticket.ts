import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import SnoozeExpired from '@seventy-seven/email/emails/snooze-expired'
import { prisma } from '@seventy-seven/orm/prisma'
import { schemaTask } from '@trigger.dev/sdk/v3'
import { z } from 'zod'

const resend = createResendClient()

export const unsnoozeTicketTask = schemaTask({
  id: 'unsnooze-ticket',
  schema: z.object({
    userId: z.string().uuid(),
    userEmail: z.string().email(),
    ticketId: z.string().uuid(),
  }),
  run: async (payload) => {
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: payload.ticketId,
        team: {
          members: {
            some: {
              user_id: payload.userId,
            },
          },
        },
      },
      data: {
        snoozed_until: null,
        event_id: null,
      },
      select: {
        id: true,
        short_id: true,
        subject: true,
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
          take: 5,
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    const template = SnoozeExpired({
      shortId: updatedTicket.short_id,
      subject: updatedTicket.subject,
      thread: updatedTicket.messages,
      ticketUrl:
        process.env.VERCEL_ENV === 'production'
          ? `https://app.seventy-seven.dev/inbox?ticketId=${updatedTicket.id}`
          : `http://localhost:3000/inbox?ticketId=${updatedTicket.id}`,
    })

    const { data, error } = await resend.emails.send({
      from: 'Seventy Seven <seventy-seven@seventy-seven.dev>',
      to: [payload.userEmail],
      subject: `Snooze Alert #${updatedTicket.short_id}`,
      react: template,
      text: componentToPlainText(template),
    })

    if (error) {
      throw new Error('Error sending email', { cause: error })
    }

    if (!data) {
      throw new Error('No data returned from Resend')
    }

    return data
  },
})
