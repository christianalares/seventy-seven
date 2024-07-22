import type { Status } from '@/lib/search-params'
import { Prisma, prisma } from '@seventy-seven/orm/prisma'
import { api } from '.'

export type TicketsFindMany = Awaited<ReturnType<typeof findMany>>
export type TicketsFindById = NonNullable<Awaited<ReturnType<typeof findById>>>

type FindManyFilters = {
  statuses?: Status[]
  memberIds?: string[]
  tags?: string[]
  query?: string
}

const findMany = async ({ statuses = [], memberIds = [], tags = [], query = '' }: FindManyFilters) => {
  const user = await api.users.queries.findMe()

  const SELECT = {
    id: true,
    created_at: true,
    subject: true,
    snoozed_until: true,
    starred_at: true,
    closed_at: true,
    tags: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    },
    assigned_to_user: {
      select: {
        id: true,
        full_name: true,
        image_url: true,
      },
    },
    messages: {
      take: 1,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        created_at: true,
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
  } satisfies Prisma.TicketSelect

  const AND: Prisma.TicketWhereInput['AND'] =
    memberIds.length === 0 ? undefined : [...(memberIds.length > 0 ? [{ assigned_to_user_id: { in: memberIds } }] : [])]

  const OR: Prisma.TicketWhereInput['OR'] =
    statuses.length === 0 && tags.length === 0 && !query
      ? undefined
      : [
          ...(statuses.includes('unhandled') ? [{ closed_at: null }] : []),
          ...(statuses.includes('starred') ? [{ starred_at: { not: null } }] : []),
          ...(statuses.includes('snoozed') ? [{ snoozed_until: { not: null } }] : []),
          ...(statuses.includes('closed') ? [{ closed_at: { not: null } }] : []),
          ...(tags.length > 0
            ? [
                {
                  tags: {
                    some: {
                      tag: {
                        id: {
                          in: tags,
                        },
                      },
                    },
                  },
                },
              ]
            : []),
          ...(query.length > 0
            ? [
                {
                  subject: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },

                {
                  messages: {
                    some: {
                      body: {
                        contains: query,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              ]
            : []),
        ]

  // const tickets = await cache(
  //   () => {
  //     console.log('[CACHE MISS] prisma.ticket.findMany')

  //     return prisma.ticket.findMany({
  //       where: {
  //         team_id: user.current_team_id,
  //         AND,
  //         OR,
  //       },
  //       select: SELECT,
  //       orderBy: { created_at: 'desc' },
  //     })
  //   },
  //   ['tickets'],
  //   { tags: ['tickets'] },
  // )()

  const tickets = await prisma.ticket.findMany({
    where: {
      team_id: user.current_team_id,
      AND,
      OR,
    },
    select: SELECT,
    orderBy: { created_at: 'desc' },
  })

  // "Unhandled" tickets are those where the last message was sent by a customer and not a team member.
  // Think of it as "unread" or "not responded to"
  const ticketsWithHandledStatus = tickets.map((ticket) => {
    const lastMessage = ticket.messages.at(-1)
    const isUnhandled = !lastMessage?.handler

    return {
      ...ticket,
      isUnhandled,
    }
  })

  if (statuses.length > 0 && statuses.includes('unhandled')) {
    return ticketsWithHandledStatus.filter((ticket) => ticket.isUnhandled)
  }

  return ticketsWithHandledStatus
}

const findById = async (id: string) => {
  const user = await api.users.queries.findMe()

  const ticket = await prisma.ticket.findFirst({
    where: {
      // Make sure the ticket belongs to the user's team
      team: {
        id: user.current_team_id,
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
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      },
      assigned_to_user: {
        select: {
          id: true,
          full_name: true,
          image_url: true,
        },
      },
      team: {
        select: {
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  full_name: true,
                  image_url: true,
                },
              },
            },
          },
        },
      },
      messages: {
        select: {
          created_at: true,
          id: true,
          unable_to_parse_content: true,
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
