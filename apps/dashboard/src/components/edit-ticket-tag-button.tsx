'use client'

import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { pushModal } from './modals'

type Props = {
  tag: UsersGetMyCurrentTeam['current_team']['ticket_tags'][number]
}

export const EditTicketTagButton = ({ tag }: Props) => {
  return (
    <Button size="icon" variant="ghost" onClick={() => pushModal('editTicketTagModal', { tag })}>
      <Icon name="settings2" className="size-4" />
      <span className="sr-only">Edit</span>
    </Button>
  )
}
