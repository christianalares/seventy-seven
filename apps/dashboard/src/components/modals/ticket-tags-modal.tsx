'use client'

import { setTags } from '@/actions/ticket-tags'
import type { TicketsFindById } from '@/queries/tickets'
import { getRandomTagColor } from '@/utils/colors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { cn } from '@seventy-seven/ui/utils'
import { useAnimate } from 'framer-motion'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { type ElementRef, useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { popModal } from '.'

type Props = {
  ticket: TicketsFindById
}

const tagsFormSchema = z.object({
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.string().startsWith('#').max(7),
    }),
  ),
})

type TagFormValues = z.infer<typeof tagsFormSchema>

export const TicketTagsModal = ({ ticket }: Props) => {
  const pathname = usePathname()

  const action = useAction(setTags, {
    onSuccess: () => {
      toast.success('Tags updated')
      popModal('ticketTagsModal')
    },
    onError: (error) => {
      toast.error(error.serverError)
    },
  })

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagsFormSchema),
    defaultValues: {
      tags: ticket.tags.map(({ tag }) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
    },
  })

  const {
    fields: tags,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: 'tags',
  })

  const [isMarkedForDeletion, setIsMarkedForDeletion] = useState(false)
  const inputRef = useRef<ElementRef<'input'>>(null)
  const [inputValue, setInputValue] = useState('')

  const [scope, animate] = useAnimate()

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [])

  useEffect(() => {
    if (inputValue.length > 0) {
      setIsMarkedForDeletion(false)
    }
  }, [inputValue])

  const onSubmit = form.handleSubmit((values) => {
    action.execute({
      revalidatePath: pathname,
      ticketId: ticket.id,
      tags: values.tags,
    })
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Edit tags</ModalTitle>
        <ModalDescription>Select which tags you want to use for this ticket</ModalDescription>
      </ModalHeader>

      <form onSubmit={onSubmit}>
        <div
          ref={scope}
          className="p-2 inline-flex gap-2 items-center flex-wrap rounded-md w-full border border-input bg-background-100 ring-offset-background has-[input:focus]:ring-2 has-[input:focus]:ring-ring has-[input:focus]:ring-offset-2"
        >
          {tags.map((tag, i) => {
            const isCreating = tag.id.startsWith('loading')

            return (
              <span
                data-tag={tag.name.toLowerCase()}
                key={tag.id}
                className={cn('inline-flex py-1 px-2 rounded-md gap-2 items-center text-sm', {
                  'ring-2 ring-destructive ring-offset-1': isMarkedForDeletion && i === tags.length - 1,
                  'opacity-60': isCreating,
                })}
                style={{
                  backgroundColor: tag.color,
                }}
              >
                {tag.name}

                <Button
                  size="icon-sm"
                  variant="outline"
                  className="rounded-full size-4"
                  onClick={() => removeTag(i)}
                  disabled={isCreating}
                >
                  <span className="sr-only">Remove tag</span>
                  <Icon name="close" className="size-3" />
                </Button>
              </span>
            )
          })}

          <input
            ref={inputRef}
            placeholder="Add a tag ↵"
            className="focus-visible:outline-none flex-1 min-w-20 py-1 text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()

                const tagAlreadyExists = tags.some((tag) => tag.name.toLowerCase() === inputValue.toLowerCase())

                if (inputValue) {
                  if (tagAlreadyExists) {
                    animate(
                      `span[data-tag="${inputValue.toLowerCase()}"]`,
                      {
                        scale: [1, 1.3, 1],
                      },
                      {
                        duration: 0.3,
                      },
                    )
                    return
                  }

                  appendTag({
                    id: `new-tag_${inputValue}`,
                    name: inputValue,
                    color: getRandomTagColor(),
                  })

                  setInputValue('')
                }
              }

              if (e.key === 'Backspace' && inputValue === '') {
                if (!isMarkedForDeletion) {
                  setIsMarkedForDeletion(true)
                  return
                }

                removeTag(-1)
                setIsMarkedForDeletion(false)
                setInputValue('')
              }
            }}
          />
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
            Save tags
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
