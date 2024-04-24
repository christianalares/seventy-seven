'use server'

import { authAction } from '@/lib/safe-action'
import { prisma } from '@seventy-seven/orm/prisma'
import { z } from 'zod'

export const updateDisplayName = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    displayName: z.string().optional(),
  }),
  async (values, user) => {
    const updatedUser = prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        full_name: values.displayName,
      },
      select: {
        full_name: true,
      },
    })

    return updatedUser
  },
)
