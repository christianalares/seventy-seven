'use server'

import { prisma } from '@/lib/prisma'
import { authAction } from '@/lib/safe-action'
import { getUser } from '@/utils/supabase/session'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const createMessage = authAction(
  z.object({
    ticketId: z.string().uuid(),
    body: z.string().min(1).max(1000),
  }),
  async (values, user) => {
    const dbUser = await getUser()

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
        sent_by_user_id: user.id,
      },
    })

    revalidatePath(`/ticket/${createdMessage.ticket_id}`)

    return createdMessage
  },
)
