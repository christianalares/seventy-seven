'use server'

import { analyticsClient } from '@/lib/analytics'
import { authAction } from '@/lib/safe-action'
import { usersQueries } from '@/queries/users'
import { TEAM_ROLE_ENUM, prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
import { uuid } from 'uuidv4'
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

    analyticsClient.event('team_created', {
      team_id: createdTeam.id,
      profileId: user.id,
      team_name: createdTeam.name,
    })

    return createdTeam
  },
)

export const setCurrentTeam = authAction(
  z.object({
    revalidatePath: z.string().optional(),
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
            id: true,
            name: true,
          },
        },
      },
    })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('team_switched', {
      team_id: values.teamId,
      profileId: user.id,
    })

    return updatedUser
  },
)

export const leaveTeam = authAction(
  z.object({
    revalidatePath: z.string().optional(),
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

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('team_left', {
      team_id: leftTeam.team.id,
      profileId: user.id,
    })

    return leftTeam
  },
)

export const removeMember = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    teamId: z.string().uuid(),
    memberId: z.string().uuid(),
  }),
  async (values, user) => {
    const dbTeam = await prisma.team.findUnique({
      where: {
        id: values.teamId,
        // Make sure the user is a owner of the team
        members: {
          some: {
            user_id: user.id,
            role: 'OWNER',
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
      throw new Error("You don't have access to this team")
    }

    if (dbTeam.members.length <= 1) {
      throw new Error('You are the last owner of the team. If you want to leave the team, please delete it instead.')
    }

    const deletedUserOnTeam = await prisma.userOnTeam.delete({
      where: {
        user_id_team_id: {
          user_id: values.memberId,
          team_id: dbTeam.id,
        },
      },
      select: {
        user: {
          select: {
            full_name: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('team_member_removed', {
      team_id: dbTeam.id,
      profileId: user.id,
    })

    return deletedUserOnTeam
  },
)

export const updateTeamName = authAction(
  z.object({
    revalidatePath: z.string().optional(),
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

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('team_name_updated', {
      team_id: values.teamId,
      profileId: user.id,
    })

    return updatedTeam
  },
)

export const changeMemberRole = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    teamId: z.string().uuid(),
    memberId: z.string().uuid(),
    role: z.nativeEnum(TEAM_ROLE_ENUM),
  }),
  async (values, user) => {
    const dbTeam = await prisma.team.findUnique({
      where: {
        id: values.teamId,
      },
      select: {
        id: true,
        members: {
          select: {
            role: true,
            user_id: true,
          },
        },
      },
    })

    if (!dbTeam) {
      throw new Error('Could not find team')
    }

    const userInTeam = dbTeam.members.find((member) => member.user_id === user.id)

    if (!userInTeam) {
      throw new Error('You are not a member of this team')
    }

    if (userInTeam.role !== 'OWNER') {
      throw new Error('You do not have permission to change roles')
    }

    if (!dbTeam.members.some((member) => member.user_id === values.memberId)) {
      throw new Error('User is not a member of this team')
    }

    const updatedUserOnTeam = await prisma.userOnTeam.update({
      where: {
        user_id_team_id: {
          user_id: values.memberId,
          team_id: dbTeam.id,
        },
      },
      data: {
        role: values.role,
      },
      select: {
        role: true,
        user: {
          select: {
            full_name: true,
          },
        },
      },
    })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('team_member_role_changed', {
      team_id: dbTeam.id,
      profileId: user.id,
    })

    return updatedUserOnTeam
  },
)

export const generateAuthToken = authAction(
  z.object({
    revalidatePath: z.string().optional(),
  }),
  async (values, user) => {
    const usresCurrentTeam = await usersQueries.myCurrentTeam()

    const randomToken = Buffer.from(`${uuid()}_${uuid()}`).toString('base64')

    await prisma.team
      .update({
        where: {
          id: usresCurrentTeam.current_team.id,
          // Make sure the user is an owner of the team
          members: {
            some: {
              user_id: user.id,
              role: 'OWNER',
            },
          },
        },
        data: {
          auth_token: randomToken,
        },
        select: {
          auth_token: true,
        },
      })
      .catch((_error) => {
        throw new Error('Could not generate auth token')
      })

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('auth_token_generated', {
      team_id: usresCurrentTeam.current_team.id,
      profileId: user.id,
    })

    return {
      isNew: !usresCurrentTeam.current_team.auth_token,
    }
  },
)

export const updateTeamAvatar = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    avatarUrl: z.string().url(),
  }),
  async (values) => {
    const dbUser = await usersQueries.myCurrentTeam()

    const updatedTeam = await prisma.team
      .update({
        where: {
          id: dbUser.current_team.id,
        },
        data: {
          image_url: values.avatarUrl,
        },
        select: {
          image_url: true,
        },
      })
      .catch(() => {
        throw new Error('Could not update team avatar')
      })

    if (!updatedTeam) {
      throw new Error('Could not update team avatar')
    }

    if (values.revalidatePath) {
      revalidatePath(values.revalidatePath)
    }

    analyticsClient.event('team_avatar_updated', {
      team_id: dbUser.current_team.id,
      profileId: dbUser.id,
    })

    return updatedTeam
  },
)
