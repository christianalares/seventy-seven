'use client'

import { setCurrentTeam } from '@/actions/teams'
import type { UsersFindMe } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@seventy-seven/ui/popover'
import { Spinner } from '@seventy-seven/ui/spinner'
import { cn } from '@seventy-seven/ui/utils'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Avatar } from './avatar'

type Props = {
  user: UsersFindMe
  className?: string
}

export const TeamSelector = ({ user, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  const action = useAction(setCurrentTeam, {
    onSuccess: (updatedUser) => {
      toast.success(`Switched to team ${updatedUser.current_team.name}`)
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  const userTeams = user.teams.map(({ team }) => ({
    id: team.id,
    name: team.name,
    imageUrl: team.image_url,
  }))

  return (
    <div className={cn('flex justify-center', className)}>
      <Popover open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
        <PopoverTrigger asChild disabled={action.status === 'executing'}>
          <button type="button">
            {action.status === 'executing' ? (
              <div className="rounded-full bg-muted size-10 flex items-center justify-center text-background">
                <Spinner />
              </div>
            ) : (
              <Avatar name={user.current_team.name} imageUrl={user.current_team.image_url ?? undefined} />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent asChild side="top" align="start" className="p-2">
          <ul className="space-y-1 w-auto">
            {userTeams
              .filter((team) => team.id !== user.current_team_id)
              .map((team) => (
                <li key={team.id}>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 w-full justify-start px-2"
                    onClick={() => {
                      setIsOpen(false)

                      action.execute({
                        revalidatePath: pathname,
                        teamId: team.id,
                      })
                    }}
                  >
                    <Avatar
                      className="size-6"
                      fallbackClassName="text-xs"
                      name={team.name}
                      imageUrl={team.imageUrl ?? undefined}
                    />
                    {team.name}
                  </Button>
                </li>
              ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}
