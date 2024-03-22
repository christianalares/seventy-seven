import { cn } from '@/lib/utils'
import type { Prisma } from '@prisma/client'
import { format } from 'date-fns'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type Props = {
  ticket: Prisma.TicketGetPayload<{
    select: {
      id: true
      created_at: true
      subject: true
      sender_full_name: true
      sender_email: true
    }
  }>
}

export const TicketListItem = ({ ticket }: Props) => {
  return (
    <Link
      href={`/ticket/${ticket.id}`}
      className={cn('relative w-full text-left block p-4 border rounded-md hover:border-border-hover overflow-hidden')}
    >
      {/* {!message.read && <span className="absolute top-2 right-2 rounded-full bg-blue-500 size-2" />} */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src="https://github.com/christianalares.png" alt="@christianalares" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <span>{ticket.sender_full_name}</span>
        </div>

        <time className="text-muted text-xs" dateTime={ticket.created_at.toISOString()}>
          {format(new Date(ticket.created_at), 'MMM d - HH:mm')}
        </time>
      </div>

      <p className="mt-2">
        <span className="line-clamp-1">{ticket.subject}</span>
        <span className="mt-2 text-muted line-clamp-2">{ticket.sender_email}</span>
      </p>
    </Link>
  )
}
