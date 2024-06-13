'use client'

import { setCurrentTeam } from '@/actions/teams'
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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { pushAlert } from './alerts'

type Props = {
  teamId: string
  isCurrent: boolean
}

export const TeamActionsMenu = ({ teamId, isCurrent }: Props) => {
  const pathname = usePathname()

  const setCurrentTeamAction = useAction(setCurrentTeam, {
    onSuccess: (updatedUser) => {
      toast.success(`Team "${updatedUser.current_team.name}" is now your current team`)
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={setCurrentTeamAction.status === 'executing'}>
          {setCurrentTeamAction.status === 'executing' ? (
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
            setCurrentTeamAction.execute({
              revalidatePath: pathname,
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
