import { buttonVariants } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { useTicketFilters } from './use-ticket-filters'

type Props = {
  open: () => void
  setActiveTabId: (id: string) => void
}

export const TicketFilterList = ({ open, setActiveTabId }: Props) => {
  const { filter, hasFilters, setFilter } = useTicketFilters()

  if (!hasFilters) {
    return null
  }

  return (
    <ul className="flex items-center gap-2">
      {(filter.statuses ?? []).length > 0 && (
        <li>
          <FilterButton
            onClick={() => {
              setActiveTabId('status')
              open()
            }}
            onRemove={() => {
              setFilter({ statuses: null })
            }}
          >
            <Icon name="tag" className="size-3" />
            Statuses
          </FilterButton>
        </li>
      )}
      {(filter.assignees ?? []).length > 0 && (
        <li>
          <FilterButton
            onClick={() => {
              setActiveTabId('assignee')
              open()
            }}
            onRemove={() => {
              setFilter({ assignees: null })
            }}
          >
            <Icon name="user" className="size-3" />
            Assignees
          </FilterButton>
        </li>
      )}
    </ul>
  )
}

type FilterButtonProps = {
  children: React.ReactNode
  onClick: () => void
  onRemove: () => void
}

export const FilterButton = ({ children, onClick, onRemove }: FilterButtonProps) => {
  return (
    <p
      className={cn(
        buttonVariants({ variant: 'outline', size: 'xs' }),
        'flex items-center text-xs px-0 [&:not(:disabled)]:hover:bg-background',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="h-full px-2 rounded-l-md flex items-center gap-2 hover:underline"
      >
        {children}
      </button>

      <button
        type="button"
        className="rounded-full size-5 mr-2 flex items-center justify-center hover:bg-secondary/80"
        onClick={onRemove}
      >
        <Icon name="close" className="size-4" />
      </button>
    </p>
  )
}
