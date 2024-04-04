import { ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'

export const SnoozeTicketModal = () => {
  return (
    <div className="">
      <ModalHeader>
        <ModalTitle>Snooze Ticket</ModalTitle>
        <ModalDescription>When the time has expired this will automatically be put back in your inbox</ModalDescription>
      </ModalHeader>

      <p>TODO: Date/Time picker</p>
    </div>
  )
}
