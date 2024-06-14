'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { pushModal } from './modals'

type Props = {
  className?: string
}

export const CreateTeamButton = ({ className }: Props) => {
  return (
    <Button onClick={() => pushModal('createTeamModal')} className={cn('gap-2', className)}>
      <Icon name="plus" className="size-5" />
      Create team
    </Button>
  )
}
