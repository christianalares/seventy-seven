import { Button } from '@seventy-seven/ui/button'
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { popModal, pushModal } from '.'

type Props = {
  message: string
  messageId: string
}

export const ViewOriginalMessageContentModal = ({ message, messageId }: Props) => {
  return (
    <Modal className="max-h-[95vh] max-w-[85vw] flex flex-col">
      <ModalHeader>
        <ModalTitle>Original message content</ModalTitle>
        <ModalDescription>
          This message contains content that the parser could not extract.
          <br />
          If you want, you can edit this message so it looks better in the chat.
        </ModalDescription>
      </ModalHeader>

      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div dangerouslySetInnerHTML={{ __html: message }} className="border-2 border-dotted overflow-y-auto p-4" />

      <ModalFooter>
        <Button variant="secondary" onClick={() => popModal('viewOriginalMessageContentModal')}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            pushModal('editOriginalMessageModal', {
              message,
              messageId,
            })
          }
        >
          Edit message
        </Button>
      </ModalFooter>
    </Modal>
  )
}
