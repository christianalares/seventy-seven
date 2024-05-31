'use client'

import { createPushModal } from '@seventy-seven/ui/modal'
import { AssignTicketModal } from './assign-ticket-modal'
import { CreateSeventySevenTicketModal } from './create-seventy-seven-ticket-modal'
import { CreateTeamModal } from './create-team-modal'
import { EditOriginalMessageModal } from './edit-original-message-modal'
import { EditTicketTagModal } from './edit-ticket-tag-modal'
import { InviteTeamMemberModal } from './invite-team-member-modal'
import { SnoozeTicketModal } from './snooze-ticket-modal'
import { TicketTagsModal } from './ticket-tags-modal'
import { ViewOriginalMessageContentModal } from './view-original-message-content-modal.tsx'

export const { pushModal, popModal, ModalProvider } = createPushModal({
  modals: {
    createTeamModal: CreateTeamModal,
    snoozeTicketModal: SnoozeTicketModal,
    inviteTeamMemberModal: InviteTeamMemberModal,
    assignTicketModal: AssignTicketModal,
    createSeventySevenTicketModal: CreateSeventySevenTicketModal,
    ticketTagsModal: TicketTagsModal,
    viewOriginalMessageContentModal: ViewOriginalMessageContentModal,
    editOriginalMessageModal: EditOriginalMessageModal,
    editTicketTagModal: EditTicketTagModal,
  },
})
