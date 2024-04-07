import { prisma } from '@seventy-seven/orm/prisma'
import { usersQueries } from './users'

export const FOLDERS = ['snoozed', 'drafts', 'responded', 'closed'] as const
export type Folder = (typeof FOLDERS)[number]

export type TicketsFindMany = Awaited<ReturnType<typeof findMany>>
export type TicketsFindById = NonNullable<Awaited<ReturnType<typeof findById>>>

const findMany = async (folder?: Folder) => {
  const user = await usersQueries.findMe()

  const tickets = await prisma.ticket.findMany({
    where: {
      team_id: user.current_team_id,
      // If the folder is snoozed, only return tickets that have a snoozed_until date
      ...(folder === 'snoozed'
        ? {
            NOT: {
              snoozed_until: null,
            },
          }
        : {}),
    },
    select: {
      id: true,
      created_at: true,
      subject: true,
      snoozed_until: true,
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
