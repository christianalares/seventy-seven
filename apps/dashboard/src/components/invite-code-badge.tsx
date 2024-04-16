'use client'

import { Badge } from '@seventy-seven/ui/badge'
import { Icon } from '@seventy-seven/ui/icon'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

type Props = {
  code: string
}
export const InviteCodeBadge = ({ code }: Props) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleOnClick = () => {
    const url = new URL(`/invite/${code}`, window.location.origin)

    navigator.clipboard.writeText(url.toString())
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 800)
  }

  return (
    <button type="button" className="relative" onClick={handleOnClick}>
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

      <Badge variant="outline" className="font-normal gap-2">
        {code}
        <Icon name="clipboardCopy" className="size-3" />
      </Badge>
    </button>
  )
}
