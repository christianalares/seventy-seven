'use client'

import { Button } from '@seventy-seven/ui/button'
import { cn } from '@seventy-seven/ui/utils'
import { useCreateTeamModal } from './modals/create-team-modal'

type Props = {
  className?: string
}

export const CreateTeamButton = ({ className }: Props) => {
  const { open: openCreateTeamModal } = useCreateTeamModal()

  return (
    <Button variant="secondary" onClick={openCreateTeamModal} className={cn(className)}>
      Create team
    </Button>
  )
}
