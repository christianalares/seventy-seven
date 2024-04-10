'use client'

import { toggleStar } from '@/actions/tickets'
import { pushModal } from '@/components/modals'
import type { TicketsFindById } from '@/queries/tickets'
import { getIconStyle } from '@/utils/get-icon-style'
import { Button } from '@seventy-seven/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@seventy-seven/ui/dropdown-menu'
import { Icon } from '@seventy-seven/ui/icon'
import { Spinner } from '@seventy-seven/ui/spinner'
import { cn } from '@seventy-seven/ui/utils'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

type Props = {
  ticket: TicketsFindById
}

export const TicketActionDropdown = ({ ticket }: Props) => {
  const toggleStarAction = useAction(toggleStar, {
    onSuccess: (updatedTicket) => {
      toast.success(`Ticket was ${updatedTicket.wasStarred ? 'starred' : 'unstarred'}`)
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  const isLoading = toggleStarAction.status === 'executing'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="outline" className="gap-2">
          Actions
          {isLoading ? <Spinner className="size-5" /> : <Icon name="chevronDown" className="size-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="gap-2"
          onSelect={() =>
            pushModal('snoozeTicketModal', {
              ticketId: ticket.id,
            })
          }
        >
          <Icon name={getIconStyle('snoozed').name} className={cn('size-4', getIconStyle('snoozed').className)} />
          Snooze
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={toggleStarAction.status === 'executing'}
          className="gap-2"
          onSelect={() => toggleStarAction.execute({ ticketId: ticket.id, star: !ticket.starred_at })}
        >
          <Icon
            name={getIconStyle('starred').name}
            className={cn('size-4', getIconStyle('starred').className, {
              'animate-rotate': toggleStarAction.status === 'executing',
            })}
          />
          {ticket.starred_at ? 'Unstar' : 'Star'}
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2">
          <Icon name={getIconStyle('closed').name} className={cn('size-4', getIconStyle('closed').className)} />
          Close
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
