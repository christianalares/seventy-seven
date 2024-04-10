'use server'

import { authAction } from '@/lib/safe-action'
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
