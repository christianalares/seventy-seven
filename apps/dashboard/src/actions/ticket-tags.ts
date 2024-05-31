'use server'

import { authAction } from '@/lib/safe-action'
import { usersQueries } from '@/queries/users'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const setTags = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    ticketId: z.string().uuid(),
    tags: z.array(
      z.object({
        name: z.string(),
        color: z.string().startsWith('#').max(7),
      }),
    ),
  }),
  async (values) => {
    const dbUser = await usersQueries.findMe()

    const userBelongsToTeamWithTicket = dbUser.teams.some(({ team }) => {
      return team.tickets.some((ticket) => ticket.id === values.ticketId)
    })

    if (!userBelongsToTeamWithTicket) {
      throw new Error('You do not have access to this ticket')
    }

    const allExistingTagsOnTicket = await prisma.ticketTag.findMany({
      where: {
        ticket_id: values.ticketId,
      },
    })

    const ticketsToCreate = values.tags.filter(
      (tag) =>
        !allExistingTagsOnTicket.some((existingTag) => existingTag.name.toLowerCase() === tag.name.toLowerCase()),
    )

    const ticketsToDelete = allExistingTagsOnTicket.filter(
      (existingTag) => !values.tags.some((tag) => tag.name.toLowerCase() === existingTag.name.toLowerCase()),
    )

    const [createdTags, deletedTags] = await prisma
      .$transaction([
        prisma.ticketTag.createManyAndReturn({
          data: ticketsToCreate.map((tag) => ({
            ticket_id: values.ticketId,
            team_id: dbUser.current_team_id,
            name: tag.name,
            color: tag.color,
          })),
          select: {
            id: true,
            name: true,
            color: true,
          },
        }),
        prisma.ticketTag.deleteMany({
          where: {
            id: {
              in: ticketsToDelete.map((tag) => tag.id),
            },
          },
        }),
      ])
      .catch((_err) => {
        throw new Error('Failed to set tags')
      })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    return {
      createdTags,
      deletedTags,
    }
  },
)
