'use client'

import type { Folder, TicketsFindMany } from '@/queries/tickets'
import { getIconStyle } from '@/utils/get-icon-style'
import { Badge } from '@seventy-seven/ui/badge'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { format, isToday } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Avatar } from './avatar'

type Props = {
  ticket: TicketsFindMany[number]
  folder?: Folder
}

export const TicketListItem = ({ ticket, folder }: Props) => {
  const { ticketId } = useParams<{ ticketId?: string }>()

  const isActive = ticket.id === ticketId
  const href = folder ? `/inbox/${folder}/${ticket.id}` : `/inbox/${ticket.id}`

  return (
    <Link
      href={href}
      className={cn('relative hover:bg-muted/5 dark:hover:bg-muted/30 p-4 rounded-md', {
        'bg-muted/5 dark:bg-muted/30': isActive,
      })}
    >
      {ticket.snoozed_until && (
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="gap-2 font-normal items-center text-muted-foreground">
            {format(ticket.snoozed_until, isToday(ticket.snoozed_until) ? 'HH:mm' : 'MMM dd (HH:mm)')}
            <Icon name={getIconStyle('snoozed').name} className={cn('size-4', getIconStyle('snoozed').className)} />
          </Badge>
        </div>
      )}
      <p className="flex items-center gap-2">
        <Avatar name={ticket.sender_full_name} imageUrl={ticket.sender_avatar_url ?? undefined} className="size-7" />
        <span className="font-medium">{ticket.sender_full_name}</span>
      </p>

      <p className="mt-2">{ticket.subject}</p>
      <p className="mt-2 text-muted truncate text-sm">{ticket.messages.at(-1)?.body}</p>
    </Link>
  )
}
