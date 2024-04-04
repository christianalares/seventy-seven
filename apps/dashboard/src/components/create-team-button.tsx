'use client'

import { Button } from '@seventy-seven/ui/button'
import { cn } from '@seventy-seven/ui/utils'
import { pushModal } from './modals'

type Props = {
  className?: string
}

export const CreateTeamButton = ({ className }: Props) => {
  return (
    <Button variant="secondary" onClick={() => pushModal('createTeamModal')} className={cn(className)}>
      Create team
    </Button>
  )
}
