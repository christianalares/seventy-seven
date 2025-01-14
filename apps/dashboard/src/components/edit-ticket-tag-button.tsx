'use client'

import type { UsersRouter } from '@/trpc/routers/users-router'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { pushModal } from './modals'

type Props = {
  tag: UsersRouter.MyCurrentTeam['current_team']['ticket_tags'][number]
}

export const EditTicketTagButton = ({ tag }: Props) => {
  return (
    <Button size="icon" variant="ghost" onClick={() => pushModal('editTicketTagModal', { tag })}>
      <Icon name="settings2" className="size-4" />
      <span className="sr-only">Edit</span>
    </Button>
  )
}
