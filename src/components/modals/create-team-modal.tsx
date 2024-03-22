'use client'

import { createTeam } from '@/actions/team'
import { useAction } from 'next-safe-action/hooks'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { CreateTeamForm } from '../forms/create-team-form'
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
  const { isOpen, setIsOpen, close } = useCreateTeamModal()
  const action = useAction(createTeam, {
    onSuccess: (createdTeam) => {
      close()
      toast.success(`Team "${createdTeam.name}" created successfully`)
    },
    onError: (err, input) => {
      close()

      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () =>
            action.execute({
              name: input.name,
            }),
        },
      })
    },
  })

  return (
    <ModalParent isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create a team</ModalTitle>
          <ModalDescription>The name of your team could be the name of your organization or company.</ModalDescription>
        </ModalHeader>

        <CreateTeamForm
          onSubmit={(values) => {
            action.execute({ name: values.name })
          }}
        />

        {/* <ModalFooter>
          <p>This is the footer</p>
        </ModalFooter> */}
      </ModalContent>
    </ModalParent>
  )
}
