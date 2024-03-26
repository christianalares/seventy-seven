'use client'

import { useStore } from '@/store'
import dynamic from 'next/dynamic'
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
})

export const ConfettiRain = () => {
  const showConfetti = useStore((state) => state.showConfetti)
  const setShowConfetti = useStore((state) => state.setShowConfetti)

  return (
    <Confetti
      run={showConfetti}
      recycle={false}
      numberOfPieces={400}
      gravity={0.3}
      className="absolute inset-0 z-10 pointer-events-none"
      onConfettiComplete={() => setShowConfetti(false)}
    />
  )
}
