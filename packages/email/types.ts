import type { Prisma } from '@seventy-seven/orm/prisma'

export type Message = Prisma.MessageGetPayload<{
  select: {
    id: true
    body: true
    created_at: true
    sent_from_full_name: true
    sent_from_email: true
    sent_from_avatar_url: true
    handler: {
      select: {
        full_name: true
        image_url: true
      }
    }
  }
}>
