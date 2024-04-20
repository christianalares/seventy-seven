import { prisma } from '@seventy-seven/orm/prisma'
import { getUser } from '@seventy-seven/supabase/session'

export type UsersFindMe = Awaited<ReturnType<typeof findMe>>
export type UsersGetMyCurrentTeam = Awaited<ReturnType<typeof myCurrentTeam>>

const findMe = async () => {
  const user = await getUser()

  if (!user) {
    throw new Error('No session found')
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
        },
      },
      teams: {
        select: {
          role: true,
          team: {
            select: {
              id: true,
              name: true,
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

export const myCurrentTeam = async () => {
  const user = await getUser()

  if (!user) {
    throw new Error('No session found')
  }

  const usersCurrentTeam = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      current_team: {
        select: {
          id: true,
          name: true,
          image_url: true,
          auth_token: true,
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
  myCurrentTeam,
}
