import { prisma } from '@seventy-seven/orm/prisma'
import { getSession } from '@seventy-seven/supabase/session'

export type UsersFindMe = Awaited<ReturnType<typeof findMe>>
export type UsersGetMyCurrentTeam = Awaited<ReturnType<typeof myCurrentTeam>>

const findMe = async () => {
  const session = await getSession()

  if (!session) {
    throw new Error('No session found')
  }

  const me = await prisma.user.findUnique({
    where: {
      id: session.user.id,
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
  const session = await getSession()

  if (!session) {
    throw new Error('No session found')
  }

  const usersCurrentTeam = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      current_team: {
        select: {
          id: true,
          name: true,
          image_url: true,
          auth_token: true,
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