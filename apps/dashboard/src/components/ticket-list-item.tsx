'use client'

import type { TicketsFindMany } from '@/queries/tickets'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Avatar } from './avatar'

type Props = {
  ticket: TicketsFindMany[number]
}

export const TicketListItemV2 = ({ ticket }: Props) => {
  const { ticketId } = useParams<{ ticketId?: string }>()

  const isActive = ticket.id === ticketId

  return (
    <Link
      href={`/inbox/${ticket.id}`}
      className={cn('hover:bg-muted/5 dark:hover:bg-muted/30 p-4 rounded-md', {
        'bg-muted/5 dark:bg-muted/30': isActive,
      })}
    >
      <p className="flex items-center gap-2">
        <Avatar name={ticket.sender_full_name} imageUrl={ticket.sender_avatar_url ?? undefined} className="size-7" />
        <span className="font-medium">{ticket.sender_full_name}</span>
      </p>

      <p className="mt-2">{ticket.subject}</p>
      <p className="mt-2 text-muted truncate text-sm">{ticket.messages.at(-1)?.body}</p>
    </Link>
  )
}
