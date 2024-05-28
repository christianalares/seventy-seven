'use server'

import { authAction } from '@/lib/safe-action'
import { usersQueries } from '@/queries/users'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const upsertTag = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    ticketId: z.string().uuid(),
    name: z.string(),
    color: z.string().startsWith('#').max(7),
  }),
  async (values) => {
    const dbUser = await usersQueries.findMe()

    const upsertedTag = await prisma.ticketTag.upsert({
      where: {
        name_ticket_id: {
          name: values.name,
          ticket_id: values.ticketId,
        },
      },
      update: {
        name: values.name,
      },
      create: {
        name: values.name,
        ticket_id: values.ticketId,
        color: values.color,
        team_id: dbUser.current_team_id,
      },
      select: {
        ticket: {
          select: {
            tags: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!upsertedTag) {
      throw new Error('Failed to add tag')
    }

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    return upsertedTag
  },
)

export const deleteTag = authAction(
  z.object({
    tagId: z.string().uuid(),
    ticketId: z.string().uuid(),
  }),
  async (values, user) => {
    const updatedTicket = await prisma.ticketTag.delete({
      where: {
        id: values.tagId,
        ticket: {
          id: values.ticketId,
          team: {
            members: {
              some: {
                user_id: user.id,
              },
            },
          },
        },
      },
      select: {
        ticket: {
          select: {
            tags: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!updatedTicket) {
      throw new Error('Failed to delete tag')
    }

    return updatedTicket
  },
)
