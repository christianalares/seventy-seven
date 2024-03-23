import { prisma } from '@/lib/prisma'
import { getUser } from '../session'

export type TeamsFindMany = Awaited<ReturnType<typeof findMany>>

const findMany = async () => {
  const user = await getUser()

  const userTeams = await prisma.userOnTeam.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      role: true,
      team: {
        select: {
          id: true,
          name: true,
          is_personal: true,
        },
      },
    },
    orderBy: {
      team: {
        created_at: 'asc',
      },
    },
  })

  return userTeams.map((team) => ({
    ...team,
    isCurrent: team.team.id === user.current_team_id,
  }))
}

export const teamsQueries = {
  findMany,
}
