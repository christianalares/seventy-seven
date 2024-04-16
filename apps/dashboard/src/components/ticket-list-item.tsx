'use client'

import { useSelectedTicket } from '@/hooks/use-selected-ticket'
import type { Folder, TicketsFindMany } from '@/queries/tickets'
import { getIconStyle } from '@/utils/get-icon-style'
import { Badge } from '@seventy-seven/ui/badge'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { format, isToday } from 'date-fns'
import Link from 'next/link'
import { Avatar } from './avatar'

type Props = {
  ticket: TicketsFindMany[number]
  folder?: Folder
}

export const TicketListItem = ({ ticket }: Props) => {
  const { ticketId } = useSelectedTicket()

  const isActive = ticket.id === ticketId
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
      href={`?ticketId=${ticket.id}`}
      className={cn('relative hover:bg-muted/5 dark:hover:bg-muted/30 p-4 rounded-md', {
        'bg-muted/5 dark:bg-muted/30': isActive,
      })}
    >
      {(ticket.snoozed_until || ticket.starred_at || ticket.closed_at || ticket.isUnhandled) && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {ticket.snoozed_until && (
            <Badge variant="outline" className="gap-2 font-normal items-center text-muted-foreground">
              {format(ticket.snoozed_until, isToday(ticket.snoozed_until) ? 'HH:mm' : 'MMM dd (HH:mm)')}
              <Icon name={getIconStyle('snoozed').name} className={cn('size-4', getIconStyle('snoozed').className)} />
            </Badge>
          )}

          {ticket.starred_at && (
            <Icon name={getIconStyle('starred').name} className={cn('size-4', getIconStyle('starred').className)} />
          )}

          {ticket.closed_at && (
            <Icon name={getIconStyle('closed').name} className={cn('size-4', getIconStyle('closed').className)} />
          )}

          {ticket.isUnhandled && (
            <Icon name={getIconStyle('unhandled').name} className={cn('size-4', getIconStyle('unhandled').className)} />
          )}
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
