import { Icon } from '@seventy-seven/ui/icon'
import { ToggleGroup, ToggleGroupItem } from '@seventy-seven/ui/toggle-group'
import { type Status, useTicketFilters } from './use-ticket-filters'

export const StatusFilter = () => {
  const { filter, setFilter } = useTicketFilters()

  const onChange = (statuses: Status[]) => {
    setFilter({
      statuses: statuses.length === 0 ? null : statuses,
    })
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <h2 className="text-sm font-medium">You can select one or more statuses</h2>

      <ToggleGroup
        type="multiple"
        className="items-start justify-start flex-wrap"
        value={filter.statuses ?? []}
        onValueChange={onChange}
      >
        <ToggleGroupItem value="unhandled" className="gap-2">
          <Icon name="circleDashed" className="size-4 text-blue-500" />
          Unhandled
        </ToggleGroupItem>
        <ToggleGroupItem value="snoozed" className="gap-2">
          <Icon name="alarmClock" className="size-4 text-orange-500" />
          Snoozed
        </ToggleGroupItem>
        <ToggleGroupItem value="starred" className="gap-2">
          <Icon name="star" className="size-4 text-amber-500" />
          Starred
        </ToggleGroupItem>
        <ToggleGroupItem value="closed" className="gap-2">
          <Icon name="checkCircle" className="size-4 text-destructive" />
          Closed
        </ToggleGroupItem>
      </ToggleGroup>

      {filter.statuses === null && (
        <div className="flex-1 flex justify-center items-center">
          <p className="text-muted">Select one or more statuses</p>
        </div>
      )}
    </div>
  )
}
