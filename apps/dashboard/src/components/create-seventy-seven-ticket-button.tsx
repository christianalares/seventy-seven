'use client'

import { pushModal } from './modals'

type Props = {
  children: React.ReactNode
}

export const CreateSeventySevenTicketButton = ({ children }: Props) => {
  return (
    <button type="button" className="text-blue-600" onClick={() => pushModal('createSeventySevenTicketModal')}>
      {children}
    </button>
  )
}
