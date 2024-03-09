'use client'

import { useMainMenuSheetStore } from '@/store'
import Link from 'next/link'
import { ThemeSelector } from './theme-selector'
import { Button } from './ui/button'
import { Icon } from './ui/icon'
import { Logo } from './ui/logo'

export const Header = () => {
  const { open: openMainMenuSheet } = useMainMenuSheetStore()

  return (
    <header className="p-4 border-b h-20 flex items-center">
      <div className="flex items-center gap-4">
        <Button className="md:hidden" onClick={openMainMenuSheet} variant="ghost" size="icon">
          <Icon name="menu" />
        </Button>

        <Link href="/" className="hover:skew-x-12 transition-transform duration-300">
          <Logo />
        </Link>
      </div>

      <ThemeSelector className="ml-auto" />
    </header>
  )
}
