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

  const lastMessage = ticket.messages.at(-1)

  const avatarName = lastMessage?.handler ? lastMessage.handler.full_name : lastMessage?.sent_from_full_name ?? ''
  const avatarImageUrl = lastMessage?.handler
    ? lastMessage.handler.image_url ?? undefined
    : lastMessage?.sent_from_avatar_url ?? undefined
  const name = lastMessage?.handler ? lastMessage.handler.full_name : lastMessage?.sent_from_full_name ?? ''

  if (!lastMessage) {
    return <p>Message could not be found</p>
  }

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
        <Avatar name={avatarName} imageUrl={avatarImageUrl} className="size-7" />
        <span className="font-medium">{name}</span>
      </p>

      <p className="mt-2">{ticket.subject}</p>
      <p className="mt-2 text-muted truncate text-sm">{lastMessage.body}</p>
    </Link>
  )
}
