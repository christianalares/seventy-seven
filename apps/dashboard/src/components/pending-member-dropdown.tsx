'use client'

import { revokeInvitation } from '@/actions/invite'
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
  inviteId: string
}

export const PendingMemberDropdown = ({ inviteId }: Props) => {
  const action = useAction(revokeInvitation, {
    onSuccess: (invitation) => {
      toast.success(`Invitation to ${invitation.email} was revoked`)
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  const isLoading = action.status === 'executing'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="ghost" size="icon-sm" className="gap-2">
          <span className="sr-only">Open</span>
          {isLoading ? <Spinner className="size-5" /> : <Icon name="moreHorizontal" className="size-5" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem variant="destructive" className="gap-2" onSelect={() => action.execute({ inviteId })}>
          <Icon name="userX" className={cn('size-4')} />
          Revoke invite
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
