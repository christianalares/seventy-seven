import { prisma } from '@seventy-seven/orm/prisma'
import { usersQueries } from './users'

export type TeamsFindMany = Awaited<ReturnType<typeof findMany>>

const findMany = async () => {
  const user = await usersQueries.findMe()

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
