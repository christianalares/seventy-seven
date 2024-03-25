'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from './ui/button'
import { Icon } from './ui/icon'

type Props = {
  text: string
}

export const ClipboardButton = ({ text }: Props) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleOnClick = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 800)
  }

  return (
    <Button variant="secondary" size="xs" className={cn('flex items-center gap-2 relative')} onClick={handleOnClick}>
      <AnimatePresence>
        {isCopied && (
          <motion.span
            className="absolute top-0 right-0 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: -20, x: 20, rotate: -30, scale: 1.4 }}
            exit={{ opacity: 0 }}
          >
            👍
          </motion.span>
        )}
      </AnimatePresence>
      <Icon name="clipboardCopy" className="size-3" />
      Copy
    </Button>
  )
}
