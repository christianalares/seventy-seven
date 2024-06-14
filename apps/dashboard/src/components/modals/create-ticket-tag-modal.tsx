'use client'

import { createTag } from '@/actions/ticket-tags'
import { getRandomTagColor } from '@/utils/colors'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { popModal } from '.'
import { TicketTagForm } from '../forms/ticket-tag-form'

export const CreateTicketTagModal = () => {
  const pathname = usePathname()

  const action = useAction(createTag, {
    onSuccess: () => {
      toast.success('Tag created')
      popModal('createTicketTagModal')
    },
    onError: (error) => {
      toast.error(error.serverError)
    },
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Create tag</ModalTitle>
        <ModalDescription>Change the color and/or the name</ModalDescription>
      </ModalHeader>

      <TicketTagForm
        defaultValues={{
          name: '',
          color: getRandomTagColor(),
        }}
        onSubmit={(values) => {
          action.execute({
            revalidatePath: pathname,
            name: values.name,
            color: values.color,
          })
        }}
        onClose={() => popModal('createTicketTagModal')}
        isLoading={action.status === 'executing'}
        ctaText="Create tag"
      />
    </Modal>
  )
}
