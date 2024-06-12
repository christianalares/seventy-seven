'use server'

import { authAction } from '@/lib/safe-action'
import { prisma } from '@seventy-seven/orm/prisma'
import { revalidatePath } from 'next/cache'
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

export const updateEmailNotifications = authAction(
  z.object({
    revalidatePath: z.string().optional(),
    type: z.union([z.literal('new_ticket'), z.literal('new_messages')]),
    value: z.boolean(),
  }),
  async (values, user) => {
    if (values.type === 'new_ticket') {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          notification_email_new_ticket: values.value,
        },
        select: {
          notification_email_new_ticket: true,
          notification_email_new_message: true,
        },
      })

      if (values.revalidatePath) {
        revalidatePath(values.revalidatePath)
      }

      return updatedUser
    }

    if (values.type === 'new_messages') {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          notification_email_new_message: values.value,
        },
        select: {
          notification_email_new_ticket: true,
          notification_email_new_message: true,
        },
      })

      if (values.revalidatePath) {
        revalidatePath(values.revalidatePath)
      }

      return updatedUser
    }
  },
)
