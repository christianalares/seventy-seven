'use client'

import { createPushModal } from '@seventy-seven/ui/modal'
import { TicketInfoSheet } from './ticket-info-sheet'

export const {
  pushModal: pushSheet,
  popModal: popSheet,
  ModalProvider: SheetProvider,
} = createPushModal({
  modals: {
    ticketInfoSheet: TicketInfoSheet,
  },
})
