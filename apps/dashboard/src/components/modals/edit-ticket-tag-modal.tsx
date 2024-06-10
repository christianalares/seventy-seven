'use client'

import { updateTag } from '@/actions/ticket-tags'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { popModal } from '.'
import { TicketTagForm } from '../forms/ticket-tag-form'

type Props = {
  tag: UsersGetMyCurrentTeam['current_team']['ticket_tags'][number]
}

export const EditTicketTagModal = ({ tag }: Props) => {
  const pathname = usePathname()

  const action = useAction(updateTag, {
    onSuccess: () => {
      toast.success('Tag updated')
      popModal('editTicketTagModal')
    },
    onError: (error) => {
      toast.error(error.serverError)
    },
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Edit tag</ModalTitle>
        <ModalDescription>Change the color and/or the name</ModalDescription>
      </ModalHeader>

      <TicketTagForm
        defaultValues={{
          name: tag.name,
          color: tag.color,
        }}
        onSubmit={(values) => {
          action.execute({
            revalidatePath: pathname,
            id: tag.id,
            name: values.name,
            color: values.color,
          })
        }}
        onClose={() => popModal('editTicketTagModal')}
        isLoading={action.status === 'executing'}
        ctaText="Save tag"
      />
    </Modal>
  )
}
