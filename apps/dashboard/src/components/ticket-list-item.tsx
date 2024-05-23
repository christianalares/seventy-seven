'use client'

import { useSelectedTicket } from '@/hooks/use-selected-ticket'
import type { TicketsFindMany } from '@/queries/tickets'
import { Icon } from '@seventy-seven/ui/icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@seventy-seven/ui/tooltip'
import { cn } from '@seventy-seven/ui/utils'
import { format, formatDistance } from 'date-fns'
import { Avatar } from './avatar'
import { TicketListItemBadges } from './ticket-list-item-badges'

type Props = {
  ticket: TicketsFindMany[number]
}

export const TicketListItem = ({ ticket }: Props) => {
  const { ticketId, setTicketId } = useSelectedTicket()

  const isActive = ticket.id === ticketId.ticketId
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
    <button
      type="button"
      onClick={() => setTicketId({ ticketId: ticket.id })}
      className={cn('text-left relative hover:bg-muted/5 dark:hover:bg-muted/30 p-4 rounded-md', {
        'bg-muted/5 dark:bg-muted/30': isActive,
      })}
    >
      <TicketListItemBadges ticket={ticket} />

      <div className="flex items-center gap-2">
        <Avatar name={avatarName} imageUrl={avatarImageUrl} className="size-7" />
        <span className="font-medium">{name}</span>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <time className="block text-muted font-normal text-xs" dateTime={lastMessage.created_at.toISOString()}>
                {formatDistance(lastMessage.created_at, new Date(), { addSuffix: true })}
              </time>
            </TooltipTrigger>

            <TooltipContent asChild>
              <span className="text-xs font-normal flex items-center gap-2">
                <Icon name="calendar" strokeWidth={2} className="size-3" />
                {format(lastMessage.created_at, 'PPpp')}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="mt-2">{ticket.subject}</p>
      <p className="mt-2 text-muted line-clamp-1 text-sm">{lastMessage.body}</p>
    </button>
  )
}
