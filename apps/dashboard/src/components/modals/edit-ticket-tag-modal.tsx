'use client'

import { updateTag } from '@/actions/ticket-tags'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Form, FormControl, FormField, FormItem } from '@seventy-seven/ui/form'
import { Input } from '@seventy-seven/ui/input'
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { popModal } from '.'

const tagFormSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, { message: 'Name is required' })
    .max(30, { message: 'Name can only be maximun 30 characters' }),
  color: z
    .string({ message: 'Color is required' })
    .startsWith('#', { message: 'Invalid color' })
    .max(7, { message: 'Invalid color' }),
})

type TagFormValues = z.infer<typeof tagFormSchema>

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

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: tag.name,
      color: tag.color,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    action.execute({
      revalidatePath: pathname,
      id: tag.id,
      name: values.name,
      color: values.color,
    })
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Edit tag</ModalTitle>
        <ModalDescription>Change the color and/or the name</ModalDescription>
      </ModalHeader>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <label>
                        <div className="size-8 rounded-full cursor-pointer" style={{ backgroundColor: field.value }}>
                          <span className="sr-only">{field.value}</span>
                        </div>
                        <input type="color" className="sr-only" {...form.register('color')} />
                      </label>
                    </FormControl>
                  </FormItem>
                )
              }}
            />

            <Input {...form.register('name')} />
          </div>

          <ModalFooter className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => popModal('ticketTagsModal')}
              disabled={action.status === 'executing'}
            >
              Cancel
            </Button>
            <Button type="submit" loading={action.status === 'executing'}>
              Save tag
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </Modal>
  )
}
