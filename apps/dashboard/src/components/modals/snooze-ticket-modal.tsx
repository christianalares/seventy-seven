import { SnoozeTicketForm } from '@/components/forms/snooze-ticket-form'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'

type Props = {
  ticketId: string
}

export const SnoozeTicketModal = ({ ticketId }: Props) => {
  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Snooze Ticket</ModalTitle>
        <ModalDescription>When the time has expired this will automatically be put back in your inbox</ModalDescription>
      </ModalHeader>

      <SnoozeTicketForm ticketId={ticketId} />
    </Modal>
  )
}
