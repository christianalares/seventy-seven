'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { CommandList } from 'cmdk'
import { cn } from '../utils'
import { Button } from './shadcn/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from './shadcn/popover'

type ComboboxItem = {
  id: string
  label: string
  disabled?: boolean
}

type Props<T> = {
  placeholder?: React.ReactNode
  searchPlaceholder?: string
  items: T[]
  onSelect: (item: T) => void
  selectedItem?: T
  renderSelectedItem?: (selectedItem: T) => React.ReactNode
  renderListItem?: (listItem: { isChecked: boolean; item: T }) => React.ReactNode
  emptyResults?: React.ReactNode
}

export function ComboboxDropdown<T extends ComboboxItem>({
  placeholder,
  searchPlaceholder,
  items,
  onSelect,
  selectedItem: incomingSelectedItem,
  renderSelectedItem,
  renderListItem,
  emptyResults,
}: Props<T>) {
  const [open, setOpen] = React.useState(false)
  const [internalSelectedItem, setInternalSelectedItem] = React.useState<T | undefined>()
  const [inputValue, setInputValue] = React.useState('')

  const selectedItem = incomingSelectedItem ?? internalSelectedItem

  const filteredItems = items.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedItem
            ? <div className="flex items-center">{renderSelectedItem?.(selectedItem)}</div> ?? selectedItem.label
            : placeholder ?? 'Select item...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        style={{
          width: 'var(--radix-popover-trigger-width)',
        }}
      >
        <Command loop shouldFilter={false}>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            placeholder={searchPlaceholder ?? 'Search item...'}
          />
          <CommandEmpty>{emptyResults ?? 'No item found'}</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {filteredItems.map((item) => {
                const isChecked = selectedItem?.id === item.id

                return (
                  <CommandItem
                    disabled={item.disabled}
                    className="cursor-pointer"
                    key={item.id}
                    value={item.id}
                    onSelect={(id) => {
                      const foundItem = items.find((item) => item.id === id)

                      if (!foundItem) {
                        return
                      }

                      onSelect(foundItem)
                      setInternalSelectedItem(foundItem)
                      setOpen(false)
                    }}
                  >
                    {renderListItem ? (
                      renderListItem({ isChecked, item })
                    ) : (
                      <>
                        <Check className={cn('mr-2 h-4 w-4', isChecked ? 'opacity-100' : 'opacity-0')} />
                        {item.label}
                      </>
                    )}
                  </CommandItem>
                )
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
