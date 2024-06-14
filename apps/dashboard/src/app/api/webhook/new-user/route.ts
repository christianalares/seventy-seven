import { analyticsClient } from '@/lib/analytics'
import { createResendClient } from '@seventy-seven/email'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const newUserWebhookPostSchema = z.object({
  type: z.union([z.literal('INSERT'), z.literal('UPDATE'), z.literal('DELETE')]),
  table: z.literal('users'),
  record: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    full_name: z.string(),
    image_url: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
    current_team_id: z.string().uuid(),
  }),
})

export async function POST(req: Request) {
  const apiKey = headers().get('X-Api-Key')

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 400 })
  }

  if (apiKey !== process.env.API_ROUTE_SECRET) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }

  const parsedBody = newUserWebhookPostSchema.safeParse(await req.json())

  if (!parsedBody.success) {
    const errors = parsedBody.error.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }))

    return NextResponse.json({ error: 'Invalid request body', errors }, { status: 400 })
  }

  const resend = createResendClient()

  const [firstName, lastName] = parsedBody.data.record.full_name.split(' ')

  // Create a new contact in Resend
  await resend.contacts.create({
    email: parsedBody.data.record.email,
    firstName,
    lastName,
    unsubscribed: false,
    // ID for the "General" audience
    audienceId: 'f90d06f7-da55-4db8-a55d-7bdbecdcba33',
  })

  analyticsClient.event('new_user', {
    email: parsedBody.data.record.email,
    full_name: parsedBody.data.record.full_name,
    profileId: parsedBody.data.record.id,
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
