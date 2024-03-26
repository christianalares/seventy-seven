import { create } from 'zustand'

type Store = {
  showConfetti: boolean
  setShowConfetti: (open: boolean) => void
}

export const useStore = create<Store>((set) => ({
  showConfetti: false,
  setShowConfetti: (showConfetti) => set({ showConfetti }),
}))
