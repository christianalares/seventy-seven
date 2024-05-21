'use client'

import { createPushModal } from '@seventy-seven/ui/modal'
import { AssignTicketModal } from './assign-ticket-modal'
import { CreateSeventySevenTicketModal } from './create-seventy-seven-ticket-modal'
import { CreateTeamModal } from './create-team-modal'
import { InviteTeamMemberModal } from './invite-team-member-modal'
import { SnoozeTicketModal } from './snooze-ticket-modal'

export const { pushModal, popModal, ModalProvider } = createPushModal({
  modals: {
    createTeamModal: CreateTeamModal,
    snoozeTicketModal: SnoozeTicketModal,
    inviteTeamMemberModal: InviteTeamMemberModal,
    assignTicketModal: AssignTicketModal,
    createSeventySevenTicketModal: CreateSeventySevenTicketModal,
  },
})
