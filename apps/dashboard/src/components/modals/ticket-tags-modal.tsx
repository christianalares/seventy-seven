import type { TicketsFindById } from '@/queries/tickets'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'

type Props = {
  ticket: TicketsFindById
}

export const TicketTagsModal = ({ ticket: _todo }: Props) => {
  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Edit tags</ModalTitle>
        <ModalDescription>Select which tags you want to use for this ticket</ModalDescription>
      </ModalHeader>

      <p>Tags!</p>
    </Modal>
  )
}
