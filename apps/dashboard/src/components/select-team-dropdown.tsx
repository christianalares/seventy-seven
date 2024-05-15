'use client'

import { setCurrentTeam } from '@/actions/teams'
import type { UsersFindMe } from '@/queries/users'
import { ComboboxDropdown } from '@seventy-seven/ui/combobox-dropdown'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar } from './avatar'

type Props = {
  user: UsersFindMe
}

export const SelectTeamDropdown = ({ user }: Props) => {
  const pathname = usePathname()

  const action = useAction(setCurrentTeam, {
    onSuccess: (updatedUser) => {
      toast.success(`Switched to team ${updatedUser.current_team.name}`)
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  const teams = user.teams.map(({ team }) => ({
    id: team.id,
    label: team.name,
    imgUrl: team.image_url,
  }))

  const foundTeam = teams.find((team) => team.id === user.current_team_id)

  return (
    <ComboboxDropdown
      size="sm"
      disabled={action.status === 'executing'}
      placeholder="Select team"
      searchPlaceholder="Search team"
      emptyResults="No team member found"
      items={teams}
      selectedItem={foundTeam}
      hideSearch
      popoverProps={{
        style: { width: 'auto', minWidth: '200px' },
        align: 'end',
      }}
      onSelect={(item) => {
        action.execute({
          revalidatePath: pathname,
          teamId: item.id,
        })
      }}
      renderSelectedItem={(selectedItem) => (
        <>
          <Avatar
            name={selectedItem.label}
            imageUrl={selectedItem.imgUrl ?? undefined}
            className="sm:mr-2 size-5"
            fallbackClassName="text-xs"
          />
          <span className="sr-only sm:not-sr-only">{selectedItem.label}</span>
        </>
      )}
      renderListItem={({ isChecked, item }) => {
        return (
          <>
            <Icon name="check" className={cn('size-4 mr-2', isChecked ? 'opacity-100' : 'opacity-0')} />
            <Avatar
              name={item.label}
              imageUrl={item.imgUrl ?? undefined}
              className="mr-2 size-5"
              fallbackClassName="text-xs"
            />
            <span>{item.label}</span>
          </>
        )
      }}
    />
  )
}
