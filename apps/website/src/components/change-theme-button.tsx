'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export const ChangeThemeButton = () => {
  const { setTheme, resolvedTheme } = useTheme()

  const onThemeChange = () => {
    if (resolvedTheme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button size="icon" variant="outline" onClick={onThemeChange} className="overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0, rotate: -90, y: 25 }}
          animate={{ opacity: 1, rotate: 0, y: 0 }}
          exit={{ opacity: 0, rotate: 90, y: 25 }}
          transition={{ duration: 0.3 }}
        >
          <Icon name={resolvedTheme === 'light' ? 'moon' : 'sun'} className="size-4" />
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}
