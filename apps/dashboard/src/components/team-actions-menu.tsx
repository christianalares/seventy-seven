'use client'

import { trpc } from '@/trpc/client'
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
import Link from 'next/link'
import { toast } from 'sonner'
import { pushAlert } from './alerts'

type Props = {
  teamId: string
  isCurrent: boolean
}

export const TeamActionsMenu = ({ teamId, isCurrent }: Props) => {
  const trpcUtils = trpc.useUtils()

  const switchTeamMutation = trpc.teams.switch.useMutation({
    onSuccess: (updatedUser) => {
      trpcUtils.users.me.invalidate()
      trpcUtils.teams.invites.invalidate()
      trpcUtils.teams.findMany.invalidate()

      toast.success(`Team "${updatedUser.current_team.name}" is now your current team`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={switchTeamMutation.isPending}>
          {switchTeamMutation.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <Icon name="moreVertical" className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={isCurrent}
          onSelect={() => {
            switchTeamMutation.mutate({
              teamId,
            })
          }}
        >
          Set as current
        </DropdownMenuItem>

        {isCurrent && (
          <DropdownMenuItem asChild>
            <Link prefetch href="/settings">
              Manage team
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={() => pushAlert('confirmLeaveTeam', { teamId })}>
          Leave team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
