'use server'

import { Events, Jobs } from '@/jobs/constants'
import { authAction } from '@/lib/safe-action'
import { jobsClient } from '@/trigger'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const snoozeTicket = authAction(
  z.object({
    ticketId: z.string().uuid(),
    snoozedUntil: z.date({ required_error: 'Snoozed date is required' }),
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
        },
      },
      {
        deliverAt: updatedTicket.snoozed_until,
      },
    )

    console.log(1, event)

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
