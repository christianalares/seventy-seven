'use client'

import type { Status } from '@/lib/search-params'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { Checkbox } from '@seventy-seven/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@seventy-seven/ui/dropdown-menu'
import { Icon, type IconName } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { Avatar } from '../avatar'
import { useTicketFilters } from './use-ticket-filters'

type StatusFilterItem = {
  id: Status
  label: string
  icon: IconName
  className: string
}

const statusItems: StatusFilterItem[] = [
  {
    id: 'unhandled',
    label: 'Unhandled',
    icon: 'circleDashed',
    className: 'text-blue-500',
  },
  {
    id: 'snoozed',
    label: 'Snoozed',
    icon: 'alarmClock',
    className: 'text-orange-500',
  },
  {
    id: 'starred',
    label: 'Starred',
    icon: 'star',
    className: 'text-amber-500',
  },
  {
    id: 'closed',
    label: 'Closed',
    icon: 'checkCircle',
    className: 'text-destructive',
  },
]

type Props = {
  userTeam: UsersGetMyCurrentTeam
}

export const TicketFiltersClient = ({ userTeam }: Props) => {
  const { filter, hasFilters, setFilter } = useTicketFilters()

  const assigneeItems = userTeam.current_team.members.map((member) => ({
    id: member.user.id,
    imageUrl: member.user.image_url,
    fullName: member.user.full_name,
  }))

  const handleStatusChange = (status: Status) => {
    const newStatuses = filter.statuses?.includes(status)
      ? filter.statuses.filter((s) => s !== status)
      : [...(filter.statuses ?? []), status]

    setFilter({
      statuses: newStatuses.length === 0 ? null : newStatuses,
    })
  }

  const handleAssigneeChange = (userId: string) => {
    const newAssignees = filter.assignees?.includes(userId)
      ? filter.assignees.filter((id) => id !== userId)
      : [...(filter.assignees ?? []), userId]

    setFilter({
      assignees: newAssignees.length === 0 ? null : newAssignees,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative ml-auto gap-2">
          {hasFilters && <span className="absolute block top-1 right-1 size-1.5 bg-destructive rounded-full" />}
          <Icon name="filter" className="size-3" />
          <span>Filters</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon name="tag" className="size-4 mr-2" />
              <span>Status</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {statusItems.map((status) => {
                  const isChecked = !!filter.statuses?.includes(status.id)

                  return (
                    <DropdownMenuItem
                      key={status.id}
                      onSelect={(e) => {
                        e.preventDefault()
                        handleStatusChange(status.id)
                      }}
                    >
                      <Checkbox className="mr-2 border-muted" checked={isChecked} />
                      <Icon name={status.icon} className={cn('size-4 mr-1', status.className)} />
                      <span>{status.label}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon name="user" className="size-4 mr-2" />
              <span>Assignees</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {assigneeItems.map((assignee) => {
                  const isChecked = !!filter.assignees?.includes(assignee.id)

                  return (
                    <DropdownMenuItem
                      key={assignee.id}
                      onSelect={(e) => {
                        e.preventDefault()
                        handleAssigneeChange(assignee.id)
                      }}
                    >
                      <Checkbox className="mr-2 border-muted" checked={isChecked} />
                      <Avatar
                        imageUrl={assignee.imageUrl ?? undefined}
                        name={assignee.fullName}
                        className="size-4 mr-2"
                      />
                      <span>{assignee.fullName}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
