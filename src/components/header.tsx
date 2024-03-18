'use client'

import { useMainMenuSheetStore } from '@/store'
import type { Session } from '@supabase/supabase-js'
import Link from 'next/link'
// import { ThemeSelector } from './theme-selector'
import { Button } from './ui/button'
import { Icon } from './ui/icon'
import { Logo } from './ui/logo'
import { UserMenuDropdown } from './user-menu-dropdown'

type Props = {
  user: Session['user']
}

export const Header = ({ user }: Props) => {
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

      <UserMenuDropdown className="ml-auto" user={user} />
      {/* <ThemeSelector className="ml-auto" /> */}
    </header>
  )
}
