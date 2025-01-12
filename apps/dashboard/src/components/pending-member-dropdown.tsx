'use client'

import { trpc } from '@/trpc/client'
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
import { toast } from 'sonner'

type Props = {
  inviteId: string
}

export const PendingMemberDropdown = ({ inviteId }: Props) => {
  const trpcUtils = trpc.useUtils()

  const revokeInvitationMutation = trpc.teams.revokeInvitation.useMutation({
    onSuccess: (invitation) => {
      trpcUtils.teams.invites.invalidate()

      toast.success(`Invitation to ${invitation.email} was revoked`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={revokeInvitationMutation.isPending}>
        <Button variant="ghost" size="icon-sm" className="gap-2">
          <span className="sr-only">Open</span>
          {revokeInvitationMutation.isPending ? (
            <Spinner className="size-5" />
          ) : (
            <Icon name="moreHorizontal" className="size-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          className="gap-2"
          onSelect={() => revokeInvitationMutation.mutate({ inviteId })}
        >
          <Icon name="userX" className={cn('size-4')} />
          Revoke invite
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
