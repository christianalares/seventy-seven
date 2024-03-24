import { prisma } from '@/lib/prisma'
import { getSession } from '../session'

export type UsersGetMe = Awaited<ReturnType<typeof me>>
export type UsersGetMyCurrentTeam = Awaited<ReturnType<typeof myCurrentTeam>>

export const me = async () => {
  const session = await getSession()

  if (!session) {
    throw new Error('No session found')
  }

  const user = await prisma.user.findUnique({
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

  if (!user) {
    throw new Error('User not found')
  }

  return user
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
  me,
  myCurrentTeam,
}
