import { Logo } from '@seventy-seven/ui/logo'
import Link from 'next/link'
import { Suspense } from 'react'
import { MainMenu } from './main-menu'
import { SelectTeamDropdown } from './select-team-dropdown'
import { UserMenuDropdown } from './user-menu-dropdown'

export const Header = () => {
  return (
    <header className="p-4 border-b flex items-center justify-between h-20 gap-2">
      <div className="h-full flex items-center gap-6 flex-1">
        <Link prefetch href="/" className="h-full">
          <Logo />
        </Link>

        <MainMenu className="flex-1" />
      </div>

      <div className="flex items-center gap-4">
        <Suspense>
          <SelectTeamDropdown />
          <UserMenuDropdown />
        </Suspense>
      </div>
    </header>
  )
}
