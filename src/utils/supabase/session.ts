import { prisma } from '@/lib/prisma'
import { createClient } from './server'

export const getSession = async () => {
  const sb = createClient()

  const {
    data: { session },
  } = await sb.auth.getSession()

  return session
}

export const getUser = async () => {
  const session = await getSession()

  if (!session) {
    throw new Error('No session found')
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
    include: {
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

  return user
}
