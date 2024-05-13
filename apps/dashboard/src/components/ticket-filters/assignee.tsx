import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { ComboboxDropdown } from '@seventy-seven/ui/combobox-dropdown'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { Avatar } from '../avatar'
import { useTicketFilters } from './use-ticket-filters'

type Props = {
  userTeam: UsersGetMyCurrentTeam
}

export const Assignee = ({ userTeam }: Props) => {
  const { filter, setFilter } = useTicketFilters()

  const memberItems = userTeam.current_team.members.map((member) => ({
    id: member.user.id,
    label: member.user.full_name,
    imgUrl: member.user.image_url ?? undefined,
  }))

  const selectedMembers = (filter.assignees ?? []).map(
    (memberId) => memberItems.find((member) => member.id === memberId)!,
  )

  const handleSelect = (itemId: string) => {
    setFilter((prevFilter) => {
      const newList = prevFilter.assignees?.includes(itemId)
        ? prevFilter.assignees.filter((id) => id !== itemId)
        : [...(prevFilter.assignees ?? []), itemId]

      if (newList.length === 0) {
        return {
          assignees: null,
        }
      }

      return {
        assignees: prevFilter.assignees?.includes(itemId)
          ? prevFilter.assignees.filter((id) => id !== itemId)
          : [...(prevFilter.assignees ?? []), itemId],
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <h2 className="text-sm font-medium">You can select one or more team members</h2>

      <ComboboxDropdown
        placeholder="Select team member..."
        searchPlaceholder="Search team member..."
        emptyResults="No team member found"
        items={memberItems}
        onSelect={(item) => handleSelect(item.id)}
        renderSelectedItem={(selectedItem) => (
          <>
            <Avatar name={selectedItem.label} imageUrl={selectedItem.imgUrl} className="mr-2 size-6" />
            <span>{selectedItem.label}</span>
          </>
        )}
        renderListItem={({ item }) => {
          const isChecked = filter.assignees?.includes(item.id) ?? false
          return (
            <>
              <Icon name="check" className={cn('size-4 mr-2', isChecked ? 'opacity-100' : 'opacity-0')} />
              <Avatar name={item.label} imageUrl={item.imgUrl} className="mr-2 size-6" />
              <span>{item.label}</span>
            </>
          )
        }}
      />

      {selectedMembers.length > 0 ? (
        <ul className="flex items-center gap-1">
          {selectedMembers.map((member) => (
            <li key={member.id}>
              <Button size="sm" onClick={() => handleSelect(member.id)} className="gap-2" variant="ghost">
                <Avatar name={member.label} imageUrl={member.imgUrl} className="size-5" />
                <span>{member.label}</span>
                <Icon name="close" className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <p className="text-muted">Select one or more team members</p>
        </div>
      )}
    </div>
  )
}
