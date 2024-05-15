'use client'

import { createPushModal } from '@seventy-seven/ui/modal'

export const {
  pushModal: pushSheet,
  popModal: popSheet,
  ModalProvider: SheetProvider,
} = createPushModal({
  modals: {},
})
