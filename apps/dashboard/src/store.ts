import { create } from 'zustand'

interface SheetStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useMessagesListSheetStore = create<SheetStore>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
