'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { Input } from '@seventy-seven/ui/input'
import { cn } from '@seventy-seven/ui/utils'
import { useForm } from 'react-hook-form'
import { useTicketFilters } from '../ticket-filters/use-ticket-filters'

export const TicketSearchForm = () => {
  const { filter, setFilter } = useTicketFilters()

  const form = useForm<{ query: string }>({
    defaultValues: {
      query: filter.q ?? '',
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    setFilter({
      q: values.query.trim() === '' ? null : values.query,
    })
  })

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 w-full md:w-1/2">
      <div className="w-full relative">
        <Icon name="search" className="absolute left-3 top-[50%] -translate-y-1/2 rounded-full size-4 text-muted" />

        <Input
          placeholder="Search for subject or message content"
          className={cn('pl-9', {
            'pr-9': !!filter.q,
          })}
          {...form.register('query')}
        />

        {(filter.q ?? '').length > 0 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-3 top-[50%] -translate-y-1/2 rounded-full size-5"
            onClick={() => {
              setFilter({
                q: null,
              })

              form.reset({ query: '' })
            }}
          >
            <span className="sr-only">Clear search</span>
            <Icon name="close" className="size-4" />
          </Button>
        )}
      </div>
      <Button variant="secondary" className="size-10 p-0">
        <span className="sr-only">Search</span>
        <Icon name="search" className="size-4" />
      </Button>
    </form>
  )
}
