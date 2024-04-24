import { opServerClient } from '@/lib/openpanel'
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
  const parsedBody = newUserWebhookPostSchema.safeParse(await req.json())

  if (!parsedBody.success) {
    const errors = parsedBody.error.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }))

    return NextResponse.json({ error: 'Invalid request body', errors }, { status: 400 })
  }

  opServerClient.event('new_user', {
    email: parsedBody.data.record.email,
    full_name: parsedBody.data.record.full_name,
    profileId: parsedBody.data.record.id,
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
