'use client'

import { createPushModal } from '@seventy-seven/ui/modal'
import { CreateTeamModal } from './create-team-modal'
import { SnoozeTicketModal } from './snooze-ticket-modal'

export const { pushModal, popModal, ModalProvider } = createPushModal({
  modals: {
    createTeamModal: CreateTeamModal,
    snoozeTicketModal: SnoozeTicketModal,
  },
})
