'use client'

import type { TicketsFindById } from '@/queries/tickets'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { useAnimate } from 'framer-motion'
import { type ElementRef, useEffect, useRef, useState } from 'react'
import { popModal } from '.'

type Props = {
  ticket: TicketsFindById
}

export const TicketTagsModal = ({ ticket: _todo }: Props) => {
  const inputRef = useRef<ElementRef<'input'>>(null)
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState(['Version 2.0', 'Important', 'High prio'])

  const [scope, animate] = useAnimate()

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (tags.some((tag) => tag.toLowerCase() === inputValue.toLowerCase())) {
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

    setTags([...tags, inputValue])
    setInputValue('')
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))

    inputRef.current?.focus()
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
        {tags.map((tag) => (
          <span
            data-tag={tag.toLowerCase()}
            key={tag}
            className="inline-flex bg-secondary py-1 px-2 rounded-md gap-2 items-center"
          >
            {tag}

            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-full size-4"
              onClick={() => handleRemoveTag(tag)}
            >
              <span className="sr-only">Remove tag</span>
              <Icon name="close" className="size-3" />
            </Button>
          </span>
        ))}
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
