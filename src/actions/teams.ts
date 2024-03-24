'use server'

import { prisma } from '@/lib/prisma'
import { authAction } from '@/lib/safe-action'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const createTeam = authAction(
  z.object({
    name: z.string().min(1).max(100),
  }),
  async (values, user) => {
    const createdTeam = await prisma.team.create({
      data: {
        name: values.name,
        members: {
          create: {
            user_id: user.id,
            role: 'OWNER',
          },
        },
      },
    })

    revalidatePath('/account/teams')

    return createdTeam
  },
)

export const setCurrentTeam = authAction(
  z.object({
    teamId: z.string().uuid(),
  }),
  async (values, user) => {
    const updatedUser = prisma.user.update({
      where: {
        id: user.id,
        // Make sure the user is a member of the team
        teams: {
          some: {
            team_id: values.teamId,
          },
        },
      },
      data: {
        current_team_id: values.teamId,
      },
      select: {
        current_team: {
          select: {
            name: true,
          },
        },
      },
    })

    revalidatePath('/account/teams')

    return updatedUser
  },
)

export const leaveTeam = authAction(
  z.object({
    teamId: z.string().uuid(),
  }),
  async (values, user) => {
    const dbTeam = await prisma.team.findUnique({
      where: {
        id: values.teamId,
        // Make sure the user is a member of the team
        members: {
          some: {
            user_id: user.id,
          },
        },
      },
      select: {
        id: true,
        is_personal: true,
        members: {
          select: {
            role: true,
            user_id: true,
          },
        },
      },
    })

    if (!dbTeam) {
      throw new Error('That team could not be found')
    }

    if (dbTeam.is_personal) {
      throw new Error('You cannot leave your personal team')
    }

    const isLastOwner = dbTeam.members.filter((team) => team.role === 'OWNER').length === 1

    if (isLastOwner) {
      throw new Error(
        'You are the last owner of this team. Please transfer ownership before leaving or delete the team instead.',
      )
    }

    // Use transaction to make sure the user is removed from the team and their current team is updated
    const { leftTeam } = await prisma.$transaction(async (tx) => {
      // Leave team
      const leftTeam = await tx.userOnTeam.delete({
        where: {
          user_id_team_id: {
            user_id: user.id,
            team_id: dbTeam.id,
          },
        },
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      // Get the users personal team
      const usersPersonalTeam = await prisma.team.findFirst({
        where: {
          is_personal: true,
          members: {
            some: {
              user_id: user.id,
            },
          },
        },
      })

      // This should never happen, it's more to make TS happy
      if (!usersPersonalTeam) {
        throw new Error('Could not find your personal team')
      }

      // Update the users current team
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          current_team_id: usersPersonalTeam.id,
        },
      })

      return { leftTeam, updatedUser }
    })

    revalidatePath('/account/teams')

    return leftTeam
  },
)

export const updateTeamName = authAction(
  z.object({
    teamId: z.string().uuid(),
    name: z.string().min(1).max(100),
  }),
  async (values, user) => {
    const updatedTeam = prisma.team.update({
      where: {
        id: values.teamId,
        // Make sure the user is an owner of the team
        members: {
          some: {
            user_id: user.id,
            role: 'OWNER',
          },
        },
      },
      data: {
        name: values.name,
      },
    })

    if (!updatedTeam) {
      throw new Error('Could not update team name')
    }

    return updatedTeam
  },
)
