import { jobsClient } from '@/trigger'
import { prisma } from '@seventy-seven/orm/prisma'
import { eventTrigger } from '@trigger.dev/sdk'
import { z } from 'zod'
import { Events, Jobs } from '../constants'

jobsClient.defineJob({
  id: Jobs.UNSNOOZE_TICKET.id,
  version: '0.0.1',
  name: Jobs.UNSNOOZE_TICKET.name,
  trigger: eventTrigger({
    name: Events.UNSNOOZE_TICKET,
    schema: z.object({
      userId: z.string().uuid(),
      ticketId: z.string().uuid(),
    }),
  }),
  run: async (payload, io) => {
    io.logger.info(`Unsnoozing ticket ${payload.ticketId}`)

    await prisma.ticket.update({
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
    })
  },
})
