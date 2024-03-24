import { prisma } from '@/lib/prisma'
import { usersQueries } from './users'

export type TicketsFindMany = Awaited<ReturnType<typeof findMany>>
export type TicketsFindById = Awaited<ReturnType<typeof findById>>

const findMany = async () => {
  const user = await usersQueries.me()

  const tickets = await prisma.ticket.findMany({
    where: {
      team_id: user.current_team_id,
    },
    select: {
      id: true,
      created_at: true,
      subject: true,
      sender_full_name: true,
      sender_email: true,
      sender_avatar_url: true,
      messages: {
        take: 1,
        orderBy: {
          created_at: 'asc',
        },
      },
    },
  })

  return tickets
}

const findById = async (id: string) => {
  const user = await usersQueries.me()

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
      sender_full_name: true,
      sender_email: true,
      messages: {
        select: {
          created_at: true,
          id: true,
          sent_by_user: {
            select: {
              id: true,
              full_name: true,
              image_url: true,
            },
          },
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
