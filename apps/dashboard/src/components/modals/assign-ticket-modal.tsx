import type { TicketsRouter } from '@/trpc/routers/tickets-router'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { AssignTeamMemberForm } from '../forms/assign-team-member-form'

type Props = {
  ticket: TicketsRouter.FindById
}

export const AssignTicketModal = ({ ticket }: Props) => {
  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Assign ticket</ModalTitle>
        <ModalDescription>Choose which team member you want to assign this ticket to.</ModalDescription>
      </ModalHeader>

      <AssignTeamMemberForm ticket={ticket} />
    </Modal>
  )
}
