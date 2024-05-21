'use client'

import type { UsersFindMe } from '@/queries/users'
import { pushModal } from './modals'

type Props = {
  children: React.ReactNode
  user: UsersFindMe
}

export const CreateSeventySevenTicketButton = ({ children, user }: Props) => {
  return (
    <button
      type="button"
      className="text-blue-600"
      onClick={() => pushModal('createSeventySevenTicketModal', { user })}
    >
      {children}
    </button>
  )
}
