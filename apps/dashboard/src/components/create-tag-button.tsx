'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { pushModal } from './modals'

type Props = {
  children: React.ReactNode
  className?: string
}

export const CreateTagButton = ({ children, className }: Props) => {
  return (
    <Button className={cn('gap-2', className)} onClick={() => pushModal('createTicketTagModal')}>
      <Icon name="plus" className="size-5" />
      {children}
    </Button>
  )
}
