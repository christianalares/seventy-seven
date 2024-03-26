'use server'
import { action } from '@/utils/safe-action'
import { Prisma, prisma } from '@seventy-seven/orm/prisma'
import { z } from 'zod'

export const joinWaitlist = action(
  z.object({
    email: z.string().email({ message: 'Please enter a valid email' }),
  }),
  async (values) => {
    await prisma.waitlist
      .create({
        data: {
          email: values.email,
        },
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new Error('You are already on the waiting list')
          }

          throw error
        }
      })

    return true
  },
)
