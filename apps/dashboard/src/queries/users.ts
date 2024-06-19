import { prisma } from '@seventy-seven/orm/prisma'
import { getUser } from '@seventy-seven/supabase/session'
import { redirect } from 'next/navigation'

export type UsersFindMe = Awaited<ReturnType<typeof findMe>>
export type UsersFindMaybeMe = Awaited<ReturnType<typeof findMaybeMe>>
export type UsersGetMyCurrentTeam = Awaited<ReturnType<typeof myCurrentTeam>>

const findMaybeMe = async () => {
  const user = await getUser()

  if (!user) {
    return null
  }

  const me = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  })

  return me
}

const findMe = async () => {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const me = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      current_team: {
        select: {
          id: true,
          name: true,
          image_url: true,
          ticket_tags: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
      teams: {
        select: {
          role: true,
          team: {
            select: {
              id: true,
              name: true,
              image_url: true,
              tickets: {
                select: {
                  id: true,
                  subject: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!me) {
    throw new Error('User not found')
  }

  return me
}

const myCurrentTeam = async () => {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const usersCurrentTeam = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      current_team: {
        select: {
          id: true,
          name: true,
          image_url: true,
          auth_token: true,
          ticket_tags: {
            select: {
              id: true,
              name: true,
              color: true,
            },
            orderBy: {
              created_at: 'asc',
            },
          },
          members: {
            select: {
              role: true,
              user: {
                select: {
                  id: true,
                  full_name: true,
                  email: true,
                  image_url: true,
                },
              },
            },
            orderBy: {
              created_at: 'asc',
            },
          },
        },
      },
    },
  })

  if (!usersCurrentTeam) {
    throw new Error('User not found')
  }

  return usersCurrentTeam
}

export const usersQueries = {
  findMe,
  findMaybeMe,
  myCurrentTeam,
}
