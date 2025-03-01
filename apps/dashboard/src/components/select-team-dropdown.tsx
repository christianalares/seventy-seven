'use client'

import { useSelectedTicket } from '@/hooks/use-selected-ticket'
import { trpc } from '@/trpc/client'
import { ComboboxDropdown } from '@seventy-seven/ui/combobox-dropdown'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { toast } from 'sonner'
import { Avatar } from './avatar'

export const SelectTeamDropdown = () => {
  const { ticketId, setTicketId } = useSelectedTicket()

  const trpcUtils = trpc.useUtils()
  const [user] = trpc.users.me.useSuspenseQuery()

  const switchTeamMutation = trpc.teams.switch.useMutation({
    onSuccess: (updatedUser) => {
      if (ticketId.ticketId) {
        setTicketId({ ticketId: null })
      }

      trpcUtils.users.me.invalidate()
      trpcUtils.users.myCurrentTeam.invalidate()
      trpcUtils.teams.invites.invalidate()
      trpcUtils.teams.findMany.invalidate()
      trpcUtils.tickets.findMany.invalidate()

      toast.success(`Switched to team ${updatedUser.current_team.name}`)
    },
    onError: (err) => {
      toast.error(err.message)
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
      disabled={switchTeamMutation.isPending}
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
        // Do nothing if the user is already on the selected team
        if (item.id === user.current_team_id) {
          return
        }

        switchTeamMutation.mutate({
          teamId: item.id,
        })
      }}
      renderSelectedItem={(selectedItem) => (
        <>
          <Avatar
            name={selectedItem.label}
            imageUrl={selectedItem.imgUrl ?? undefined}
            className="sm:mr-2 size-5"
            fallbackClassName="text-[10px] font-medium"
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
              fallbackClassName="text-[10px] font-medium"
            />
            <span>{item.label}</span>
          </>
        )
      }}
    />
  )
}
