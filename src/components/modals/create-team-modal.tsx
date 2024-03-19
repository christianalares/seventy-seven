'use client'

import { parseAsBoolean, useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { CreateTeamForm } from '../forms/create-team-form'
import { Button } from '../ui/button'
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalParent, ModalTitle } from '../ui/modal'

// type Props = {
//   isOpen: boolean
//   setIsOpen: (isOpen: boolean) => void
// }

export const useCreateTeamModal = () => {
  const [isOpen, _setIsOpen] = useQueryState('create-team', parseAsBoolean.withDefault(false))

  const open = useCallback(() => {
    _setIsOpen(true)
  }, [_setIsOpen])

  const close = useCallback(() => {
    _setIsOpen(null)
  }, [_setIsOpen])

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (open) {
        _setIsOpen(true)
      } else {
        _setIsOpen(null)
      }
    },
    [_setIsOpen],
  )

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  }
}

export const CreateTeamModal = () => {
  const { isOpen, setIsOpen } = useCreateTeamModal()

  return (
    <ModalParent isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create a team</ModalTitle>
          <ModalDescription>The name of your team could be the name of your organization or company</ModalDescription>
        </ModalHeader>

        <CreateTeamForm
          onSubmit={(values) => {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(values)
          }}
        />

        {/* <ModalFooter>
          <p>This is the footer</p>
        </ModalFooter> */}
      </ModalContent>
    </ModalParent>
  )
}
