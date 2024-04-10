import { prisma } from '@seventy-seven/orm/prisma'
import { z } from 'zod'
import { usersQueries } from './users'

export const folderSchema = z.union([
  z.literal('all'),
  z.literal('snoozed'),
  z.literal('starred'),
  z.literal('responded'),
  z.literal('closed'),
])

export type Folder = z.infer<typeof folderSchema>

export type TicketsFindMany = Awaited<ReturnType<typeof findMany>>
export type TicketsFindById = NonNullable<Awaited<ReturnType<typeof findById>>>

const findMany = async (folder?: Folder) => {
  const user = await usersQueries.findMe()

  const tickets = await prisma.ticket.findMany({
    where: {
      team_id: user.current_team_id,
      // If the folder is snoozed, only return tickets that have a snoozed_until date
      ...(folder === 'snoozed' && {
        NOT: {
          snoozed_until: null,
        },
      }),

      // If the folder is closed, only return tickets that have a closed_at date
      ...(folder === 'closed' && {
        NOT: {
          closed_at: null,
        },
      }),

      // If the folder is closed, only return tickets that have a closed_at date
      ...(folder === 'starred' && {
        NOT: {
          starred_at: null,
        },
      }),
    },
    select: {
      id: true,
      created_at: true,
      subject: true,
      snoozed_until: true,
      starred_at: true,
      closed_at: true,
      messages: {
        take: 1,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          sent_from_full_name: true,
          sent_from_email: true,
          sent_from_avatar_url: true,
          body: true,
          handler: {
            select: {
              id: true,
              full_name: true,
              image_url: true,
            },
          },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  return tickets
}

const findById = async (id: string) => {
  const user = await usersQueries.findMe()

  const ticket = await prisma.ticket.findFirst({
    where: {
      // Make sure the ticket belongs to the user's team
      team: {
        members: {
          some: {
            user_id: user.id,
          },
        },
      },
      id,
    },
    select: {
      id: true,
      subject: true,
      starred_at: true,
      closed_at: true,
      messages: {
        select: {
          created_at: true,
          id: true,
          handler: {
            select: {
              id: true,
              full_name: true,
              image_url: true,
            },
          },
          sent_from_full_name: true,
          sent_from_email: true,
          sent_from_avatar_url: true,
          body: true,
        },
        orderBy: {
          created_at: 'asc',
        },
      },
    },
  })

  return ticket
}

export const ticketsQueries = {
  findMany,
  findById,
}
