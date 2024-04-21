import type { TicketsFindById } from '@/queries/tickets'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { AssignTeamMemberForm } from '../forms/assign-team-member-form'

type Props = {
  ticket: TicketsFindById
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
