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
