'use client'

import { Button } from '@seventy-seven/ui/button'
import { cn } from '@seventy-seven/ui/utils'
import { useTicketFilters } from './ticket-filters/use-ticket-filters'

type Props = {
  children: React.ReactNode
  className?: string
}

export const ClearAllFiltersButton = ({ children, className }: Props) => {
  const { clearFilters } = useTicketFilters()
  return (
    <Button variant="outline" className={cn(className)} onClick={clearFilters}>
      {children}
    </Button>
  )
}
