import { cn } from '@/lib/utils'
import type { TicketsFindMany } from '@/queries/tickets'
import { format } from 'date-fns'
import Link from 'next/link'
import { Avatar } from './avatar'

type Props = {
  ticket: TicketsFindMany[number]
}

export const TicketListItem = ({ ticket }: Props) => {
  const firstMessage = ticket.messages.at(0)

  return (
    <Link
      href={`/ticket/${ticket.id}`}
      className={cn('relative w-full text-left block p-4 border rounded-md hover:border-border-hover overflow-hidden')}
    >
      {/* {!message.read && <span className="absolute top-2 right-2 rounded-full bg-blue-500 size-2" />} */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* TODO: Get real avatar */}
          <Avatar imageUrl={ticket.sender_avatar_url ?? undefined} name={ticket.sender_full_name} />

          <span>{ticket.sender_full_name}</span>
        </div>

        <time className="text-muted text-xs" dateTime={ticket.created_at.toISOString()}>
          {format(new Date(ticket.created_at), 'MMM d - HH:mm')}
        </time>
      </div>

      <p className="mt-2">
        <span className="line-clamp-1">{ticket.subject}</span>
        {firstMessage && <span className="mt-2 text-muted line-clamp-2">{firstMessage.body}</span>}
      </p>
    </Link>
  )
}
