'use server'

import { authAction } from '@/lib/safe-action'
import { usersQueries } from '@/queries/users'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import TicketClosed from '@seventy-seven/email/emails/ticket-closed'
import { Events } from '@seventy-seven/jobs/constants'
import { jobsClient } from '@seventy-seven/jobs/jobsClient'
import { prisma } from '@seventy-seven/orm/prisma'
import { isFuture } from 'date-fns'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const snoozeTicket = authAction(
  z.object({
    ticketId: z.string().uuid(),
    snoozedUntil: z
      .date({ required_error: 'Snoozed date is required' })
      .refine(isFuture, { message: 'Snoozed date must be in the future' }),
  }),
  async (values, user) => {
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: values.ticketId,
        // Make sure the user is a member of the team
        team: {
          members: {
            some: {
              user_id: user.id,
            },
          },
        },
      },
      data: {
        snoozed_until: values.snoozedUntil,
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
      await jobsClient.cancelEvent(updatedTicket.event_id)
    }

    const event = await jobsClient.sendEvent(
      {
        name: Events.UNSNOOZE_TICKET,
        payload: {
          ticketId: updatedTicket.id,
          userId: user.id,
          userEmail: user.email,
        },
      },
      {
        deliverAt: updatedTicket.snoozed_until,
      },
    )

    // Update the ticket with the event id
    await prisma.ticket.update({
      where: { id: updatedTicket.id },
      data: {
        event_id: event.id,
      },
    })

    if (!updatedTicket) {
      throw new Error('Failed to snooze ticket, something went wrong 😢')
    }

    revalidatePath('/inbox')
    revalidatePath(`/inbox/${updatedTicket.id}`)
    revalidatePath(`/inbox/snoozed/${updatedTicket.id}`)

    return updatedTicket
  },
)

export const toggleStar = authAction(
  z.object({
    ticketId: z.string().uuid(),
    star: z.boolean(),
  }),
  async (values, user) => {
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: values.ticketId,
        // Make sure the user is a member of the team
        team: {
          members: {
            some: {
              user_id: user.id,
            },
          },
        },
      },
      data: {
        starred_at: values.star ? new Date() : null,
      },
      select: {
        id: true,
        starred_at: true,
      },
    })

    if (!updatedTicket) {
      throw new Error(`Failed to ${values.star ? 'star' : 'unstar'} ticket, something went wrong 😢`)
    }

    revalidatePath('/inbox')
    revalidatePath('/inbox/starred')

    return {
      ...updatedTicket,
      wasStarred: !!updatedTicket.starred_at,
    }
  },
)

export const closeTicket = authAction(
  z.object({
    ticketId: z.string().uuid(),
  }),
  async (values, user) => {
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: values.ticketId,
        // Make sure the user is a member of the team
        team: {
          members: {
            some: {
              user_id: user.id,
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

    if (!updatedTicket) {
      throw new Error('Failed to close ticket, something went wrong 😢')
    }

    const dbUser = await usersQueries.findMe()

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
      dbUser.full_name === dbUser.current_team.name
        ? dbUser.full_name
        : `${dbUser.full_name} from ${dbUser.current_team.name}`

    const template = TicketClosed({
      handler: {
        company: {
          name: dbUser.current_team.name,
          image_url: dbUser.current_team.image_url ?? undefined,
        },
        name: dbUser.full_name,
        avatar: dbUser.image_url ?? undefined,
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
      // biome-ignore lint/suspicious/noConsoleLog: Log here
      console.log('Error sending email', error)
    }

    revalidatePath('/inbox')
    revalidatePath('/inbox/closed')

    return updatedTicket
  },
)
