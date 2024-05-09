import { ticketsQueries } from '@/queries/tickets'
import { ComboboxDropdown } from '@seventy-seven/ui/combobox-dropdown'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { Avatar } from '../avatar'

export const Assignee = () => {
  // const ticket = await ticketsQueries.findById('7ba13258-2318-4694-a355-156a98d2b16e')

  // const memberItems = (ticket?.team.members ?? []).map((member) => ({
  //   id: member.user.id,
  //   label: member.user.full_name,
  //   imgUrl: member.user.image_url ?? undefined,
  // }))

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium">You can select one or more assignees</h2>

      <ComboboxDropdown
        placeholder="Select team member..."
        searchPlaceholder="Search team member..."
        emptyResults="No team member found"
        items={[]}
        // selectedItem={foundMember}
        onSelect={(item) => {
          console.log('selected item:', item)
        }}
        // renderSelectedItem={(selectedItem) => (
        //   <>
        //     <Avatar name={selectedItem.label} imageUrl={selectedItem.imgUrl} className="mr-2 size-6" />
        //     <span>{selectedItem.label}</span>
        //   </>
        // )}
        // renderListItem={({ isChecked, item }) => {
        //   return (
        //     <>
        //       <Icon name="check" className={cn('size-4 mr-2', isChecked ? 'opacity-100' : 'opacity-0')} />
        //       <Avatar name={item.label} imageUrl={item.imgUrl} className="mr-2 size-6" />
        //       <span>{item.label}</span>
        //     </>
        //   )
        // }}
      />
    </div>
  )
}
