'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon, type IconName } from '@seventy-seven/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@seventy-seven/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@seventy-seven/ui/tabs'
import { cn } from '@seventy-seven/ui/utils'
import { useState } from 'react'
import { Assignee } from './assignee'
import { StatusFilter } from './status'
import { useTicketFilters } from './use-ticket-filters'

type Tab = {
  id: string
  icon: IconName
  label: string
  render: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: 'status',
    icon: 'tag',
    label: 'Status',
    render: <StatusFilter />,
  },
  {
    id: 'assignee',
    icon: 'user',
    label: 'Assignee',
    render: <Assignee />,
  },
]

export const TicketFilters = () => {
  const [activeTabId, setActiveTabId] = useState<Tab['id']>(tabs[0]!.id)
  const { hasFilters } = useTicketFilters()

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  return (
    <div className="px-2 h-14 flex items-center justify-end border-b">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            {hasFilters && <span className="absolute block top-2 right-2 size-2 bg-destructive rounded-full" />}
            <span className="sr-only">Filters</span>
            <Icon name="filter" className="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[650px] p-0 h-52">
          <Tabs
            className="flex flex-row h-full"
            value={activeTabId}
            onValueChange={setActiveTabId}
            orientation="vertical"
          >
            <TabsList className="h-full rounded-none bg-background border-r p-2 flex flex-col justify-start gap-1 w-48">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId
                return (
                  <TabsTrigger key={tab.id} value={tab.id} asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'gap-2 w-full justify-start data-[state=active]:bg-accent data-[state=active]:text-primary',
                      )}
                    >
                      <Icon name={tab.icon} className="size-4" />
                      <span>{tab.label}</span>
                      {isActive && <Icon name="chevronRight" className="size-4 ml-auto" />}
                    </Button>
                  </TabsTrigger>
                )
              })}
            </TabsList>
            <TabsContent value={activeTabId} className="p-4 flex-1 mt-0">
              {activeTab?.render}
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  )
}
