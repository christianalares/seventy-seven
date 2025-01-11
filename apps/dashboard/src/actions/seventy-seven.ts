'use server'

import { authAction } from '@/lib/safe-action'
import { api } from '@/queries'
import { SeventySevenClient } from '@seventy-seven/sdk'
import { z } from 'zod'

const seventySevenClient = new SeventySevenClient(process.env.SEVENTY_SEVEN_AUTH_TOKEN!)

// TODO: Move to TRPC
export const createSeventySevenTicket = authAction(
  z.object({
    fullName: z.string({ required_error: 'Sender full name is required' }),
    subject: z.string({ required_error: 'Subject is required' }),
    body: z.string({ required_error: 'Body is required' }),
  }),
  async (values) => {
    const dbUser = await api.users.queries.findMe()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const createdTicket = await seventySevenClient.createTicket({
        senderFullName: values.fullName,
        senderEmail: dbUser.email,
        subject: values.subject,
        body: values.body,
        senderAvatarUrl: dbUser.image_url ?? undefined,
      })

      return createdTicket
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }

      throw new Error('An error occurred while creating ticket')
    }
  },
)
