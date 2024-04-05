'use client'

import { pushModal } from '@/components/modals'
import { getIconStyle } from '@/utils/get-icon-style'
import { Button } from '@seventy-seven/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@seventy-seven/ui/dropdown-menu'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'

type Props = {
  ticketId: string
}

export const TicketActionDropdown = ({ ticketId }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Actions
          <Icon name="chevronDown" className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="gap-2"
          onSelect={() =>
            pushModal('snoozeTicketModal', {
              ticketId,
            })
          }
        >
          <Icon name={getIconStyle('snoozed').name} className={cn('size-4', getIconStyle('snoozed').className)} />
          Snooze
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2">
          <Icon name={getIconStyle('closed').name} className={cn('size-4', getIconStyle('closed').className)} />
          Close
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
