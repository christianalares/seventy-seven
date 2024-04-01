'use server'
import { opServerClient } from '@/utils/openpanel'
import { action } from '@/utils/safe-action'
import { componentToPlainText, createResendClient } from '@seventy-seven/email'
import WaitlistConfirmation from '@seventy-seven/email/emails/waitlist-confirmation'
import { Prisma, prisma } from '@seventy-seven/orm/prisma'
import { z } from 'zod'

export const joinWaitlist = action(
  z.object({
    email: z.string().email({ message: 'Please enter a valid email' }),
  }),
  async (values) => {
    const resend = createResendClient()

    const createdWaitlistEntry = await prisma.waitlist
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

    if (!createdWaitlistEntry) {
      throw new Error('Oops, something went wrong, try again later')
    }

    const template = WaitlistConfirmation()

    const { data, error } = await resend.emails.send({
      from: 'Christian from 77 <no-reply@seventy-seven.dev>',
      to: [createdWaitlistEntry.email],
      subject: 'Welcome to 77!',
      react: template,
      text: componentToPlainText(template),
    })

    if (error) {
      // biome-ignore lint/suspicious/noConsoleLog: Log here
      console.log(`Error sending email to ${values.email}`, error)
    }

    if (data) {
      await prisma.waitlist.update({
        where: {
          id: createdWaitlistEntry.id,
        },
        data: {
          email_id: data.id,
        },
      })

      opServerClient.event('waitlist_signup', { email: createdWaitlistEntry.email })
    }

    return true
  },
)
