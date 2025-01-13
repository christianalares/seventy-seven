'use client'

import { pushModal } from '@/components/modals'
import { trpc } from '@/trpc/client'
import type { TicketsRouter } from '@/trpc/routers/tickets-router'
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
import { toast } from 'sonner'

type Props = {
  ticket: NonNullable<TicketsRouter.FindById>
}

export const TicketActionDropdown = ({ ticket }: Props) => {
  const trpcUtils = trpc.useUtils()

  const toggleStarMutation = trpc.tickets.toggleStar.useMutation({
    onSuccess: (updatedTicket) => {
      trpcUtils.tickets.findMany.invalidate()
      trpcUtils.tickets.findById.invalidate()

      toast.success(`Ticket was ${updatedTicket.wasStarred ? 'starred' : 'unstarred'}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const closeTicketMutation = trpc.tickets.closeTicket.useMutation({
    onSuccess: (_updatedTicket) => {
      trpcUtils.tickets.findMany.invalidate()
      trpcUtils.tickets.findById.invalidate()

      toast.success('Ticket was closed')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isLoading = toggleStarMutation.isPending || closeTicketMutation.isPending

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="outline" className="gap-2 w-10 p-0 sm:w-auto sm:px-4">
          <span className="sr-only sm:not-sr-only">Actions</span>
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

        <DropdownMenuItem
          className="gap-2"
          onSelect={() =>
            pushModal('ticketTagsModal', {
              ticket,
            })
          }
        >
          <Icon name="tag" className="size-4 text-primary" />
          Edit tags
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2"
          onSelect={() => {
            // if (ticket.snoozed_until) {
            //   toast.error('Not yet implemented')
            //   return
            // }

            pushModal('snoozeTicketModal', {
              ticketId: ticket.id,
            })
          }}
        >
          <Icon name="alarmClock" className="size-4 text-orange-500" />
          {/* {ticket.snoozed_until ? 'Unsnooze' : 'Snooze'} */}
          Snooze
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={toggleStarMutation.isPending}
          className="gap-2"
          onSelect={() => toggleStarMutation.mutate({ ticketId: ticket.id, star: !ticket.starred_at })}
        >
          <Icon name="star" className="size-4 text-amber-500" />
          {ticket.starred_at ? 'Unstar' : 'Star'}
        </DropdownMenuItem>

        {!ticket.closed_at && (
          <DropdownMenuItem
            disabled={closeTicketMutation.isPending}
            className="gap-2"
            onSelect={() => closeTicketMutation.mutate({ ticketId: ticket.id })}
          >
            <Icon name="checkCircle" className="size-4 text-destructive" />
            Close
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
