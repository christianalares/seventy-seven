'use client'

import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { Icon, type IconName } from '@seventy-seven/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@seventy-seven/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@seventy-seven/ui/tabs'
import { cn } from '@seventy-seven/ui/utils'
import { useState } from 'react'
import { Assignee } from './assignee'
import { StatusFilter } from './status'
import { TicketFilterList } from './ticket-filter-list'
import { useTicketFilters } from './use-ticket-filters'

type Props = {
  userTeam: UsersGetMyCurrentTeam
}

export const TicketFiltersClient = ({ userTeam }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTabId, setActiveTabId] = useState('status')
  const { hasFilters } = useTicketFilters()

  return (
    <div className="px-2 h-14 flex items-center justify-end border-b gap-2">
      <TicketFilterList open={() => setIsOpen(true)} setActiveTabId={setActiveTabId} />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            {hasFilters && <span className="absolute block top-2 right-2 size-2 bg-destructive rounded-full" />}
            <span className="sr-only">Filters</span>
            <Icon name="filter" className="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[650px] p-0 h-60">
          <Tabs
            className="flex flex-row h-full"
            value={activeTabId}
            onValueChange={setActiveTabId}
            orientation="vertical"
          >
            <TabsList className="h-full rounded-none bg-background border-r p-2 flex flex-col justify-start gap-1 w-48">
              <TabButton id="status" icon="tag" label="Status" isActive={activeTabId === 'status'} />
              <TabButton id="assignee" icon="user" label="Assignee" isActive={activeTabId === 'assignee'} />
            </TabsList>

            <TabsContent value="status" className="p-4 flex-1 mt-0">
              <StatusFilter />
            </TabsContent>
            <TabsContent value="assignee" className="p-4 flex-1 mt-0">
              <Assignee userTeam={userTeam} />
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  )
}

type TabButtonProps = {
  id: string
  icon: IconName
  label: string
  isActive: boolean
}

const TabButton = ({ id, icon, label, isActive }: TabButtonProps) => {
  return (
    <TabsTrigger value={id} asChild>
      <Button
        variant="ghost"
        className={cn('gap-2 w-full justify-start data-[state=active]:bg-accent data-[state=active]:text-primary')}
      >
        <Icon name={icon} className="size-4" />
        <span>{label}</span>
        {isActive && <Icon name="chevronRight" className="size-4 ml-auto" />}
      </Button>
    </TabsTrigger>
  )
}
