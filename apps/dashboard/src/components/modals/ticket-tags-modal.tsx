'use client'

import { deleteTag, upsertTag } from '@/actions/ticket-tags'
import type { TicketsFindById } from '@/queries/tickets'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { cn } from '@seventy-seven/ui/utils'
import { useAnimate } from 'framer-motion'
import { useAction, useOptimisticAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { type ElementRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { popModal } from '.'

type Props = {
  ticket: TicketsFindById
}

export const TicketTagsModal = ({ ticket }: Props) => {
  const [tags, setTags] = useState(ticket.tags)

  const pathname = usePathname()

  const upsertTagAction = useAction(upsertTag, {
    onSuccess: (upsertedTag) => {
      setTags(upsertedTag.ticket.tags)
    },
  })

  const deleteTagAction = useAction(deleteTag, {
    onSuccess: (updatedTag) => {
      toast.success('Tag deleted')
      setTags(updatedTag.ticket.tags)
      inputRef.current?.focus()
    },
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
    const onKeyDown = (e: KeyboardEvent) => {
      const noOpKeys = ['Meta', 'Alt', 'Control', 'Shift', 'CapsLock', 'Escape']

      if (noOpKeys.includes(e.key)) {
        return
      }

      const isBackspacePressedWithEmptyInput = e.key === 'Backspace' && inputRef.current?.value === ''

      if (isBackspacePressedWithEmptyInput) {
        if (isMarkedForDeletion) {
          const tagToDelete = tags.at(-1)

          if (tagToDelete) {
            handleRemoveTag(tagToDelete.id)
          }
        }

        setIsMarkedForDeletion(!isMarkedForDeletion)
      } else {
        setIsMarkedForDeletion(false)
      }
    }

    inputRef.current?.addEventListener('keydown', onKeyDown)

    return () => {
      inputRef.current?.removeEventListener('keydown', onKeyDown)
    }
  }, [isMarkedForDeletion, tags])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (tags.some((tag) => tag.name.toLowerCase() === inputValue.toLowerCase())) {
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

    setTags((prevTags) => [
      ...prevTags,
      {
        id: `loading-${Math.random().toString()}`,
        name: inputValue,
        color: '#000000',
      },
    ])

    upsertTagAction.execute({
      name: inputValue,
      ticketId: ticket.id,
      color: '#000000',
      revalidatePath: pathname,
    })

    setInputValue('')
  }

  const handleRemoveTag = (tagId: string) => {
    setTags((prevFilter) => prevFilter.filter((t) => t.id !== tagId))

    deleteTagAction.execute({
      tagId,
      ticketId: ticket.id,
    })
  }

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Edit tags</ModalTitle>
        <ModalDescription>Select which tags you want to use for this ticket</ModalDescription>
      </ModalHeader>

      <div
        ref={scope}
        className="max-w-full p-2 inline-flex gap-2 items-center flex-wrap rounded-md border border-input bg-background text-sm ring-offset-background has-[input:focus]:ring-2 has-[input:focus]:ring-ring has-[input:focus]:ring-offset-2"
      >
        {tags.map((tag, i) => {
          const isCreating = tag.id.startsWith('loading')

          return (
            <span
              data-tag={tag.name.toLowerCase()}
              key={tag.id}
              className={cn('inline-flex bg-secondary py-1 px-2 rounded-md gap-2 items-center', {
                'ring-2 ring-destructive ring-offset-1': isMarkedForDeletion && i === tags.length - 1,
                'opacity-50': isCreating,
              })}
            >
              {tag.name}

              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full size-4"
                onClick={() => handleRemoveTag(tag.id)}
              >
                <span className="sr-only">Remove tag</span>
                <Icon name="close" className="size-3" />
              </Button>
            </span>
          )
        })}
        <form onSubmit={onSubmit} className="flex-1 min-w-20 inline-block py-1">
          <input
            ref={inputRef}
            placeholder="Add a tag"
            className="focus-visible:outline-none w-full"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
      </div>

      <ModalFooter>
        <Button onClick={() => popModal('ticketTagsModal')}>Done editing</Button>
      </ModalFooter>
    </Modal>
  )
}
