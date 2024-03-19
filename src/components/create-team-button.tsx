'use client'

import { cn } from '@/lib/utils'
import { useCreateTeamModal } from './modals/create-team-modal'
import { Button } from './ui/button'

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
