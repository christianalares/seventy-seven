'use client'

import { closeTicket, toggleStar } from '@/actions/tickets'
import { pushModal } from '@/components/modals'
import type { TicketsFindById } from '@/queries/tickets'
import { Button } from '@seventy-seven/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@seventy-seven/ui/dropdown-menu'
import { Icon } from '@seventy-seven/ui/icon'
import { Spinner } from '@seventy-seven/ui/spinner'
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

  const closeTicketAction = useAction(closeTicket, {
    onSuccess: (_updatedTicket) => {
      toast.success('Ticket was closed')
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  const isLoading = [toggleStarAction, closeTicketAction].some((action) => action.status === 'executing')

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
            pushModal('assignTicketModal', {
              ticket,
            })
          }
        >
          <Icon name="userPlus" className="size-4 text-primary" />
          Assign to...
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2"
          onSelect={() =>
            pushModal('snoozeTicketModal', {
              ticketId: ticket.id,
            })
          }
        >
          <Icon name="alarmClock" className="size-4 text-orange-500" />
          Snooze
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={toggleStarAction.status === 'executing'}
          className="gap-2"
          onSelect={() => toggleStarAction.execute({ ticketId: ticket.id, star: !ticket.starred_at })}
        >
          <Icon name="star" className="size-4 text-amber-500" />
          {ticket.starred_at ? 'Unstar' : 'Star'}
        </DropdownMenuItem>

        {!ticket.closed_at && (
          <DropdownMenuItem
            disabled={closeTicketAction.status === 'executing'}
            className="gap-2"
            onSelect={() => closeTicketAction.execute({ ticketId: ticket.id })}
          >
            <Icon name="checkCircle" className="'size-4 text-destructive'" />
            Close
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
