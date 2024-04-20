'use client'
import { closeTicket, toggleStar } from '@/actions/tickets'
import { pushModal } from '@/components/modals'
import type { TicketsFindById } from '@/queries/tickets'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
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
  member: UsersGetMyCurrentTeam['current_team']['members'][number]
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const TeamActionsDropdown = ({ member }: Props) => {
  // const toggleStarAction = useAction(toggleStar, {
  //   onSuccess: (updatedTicket) => {
  //     toast.success(`Ticket was ${updatedTicket.wasStarred ? 'starred' : 'unstarred'}`)
  //   },
  //   onError: (err) => {
  //     toast.error(err.serverError)
  //   },
  // })

  // const closeTicketAction = useAction(closeTicket, {
  //   onSuccess: (_updatedTicket) => {
  //     toast.success('Ticket was closed')
  //   },
  //   onError: (err) => {
  //     toast.error(err.serverError)
  //   },
  // })

  // const isLoading = [toggleStarAction, closeTicketAction].some((action) => action.status === 'executing')
  const isLoading = false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="ghost" size="icon-sm" className="gap-2">
          <span className="sr-only">Open</span>
          {isLoading ? <Spinner className="size-5" /> : <Icon name="moreHorizontal" className="size-5" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          className="gap-2"
          // onSelect={() =>
          //   pushModal('snoozeTicketModal', {
          //     ticketId: ticket.id,
          //   })
          // }
        >
          <Icon name="userX" className={cn('size-4')} />
          Leave team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
