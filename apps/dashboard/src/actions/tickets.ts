'use server'

import { authAction } from '@/lib/safe-action'
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
