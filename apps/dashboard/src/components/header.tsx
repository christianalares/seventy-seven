import { usersQueries } from '@/queries/users'
import { Logo } from '@seventy-seven/ui/logo'
import Link from 'next/link'
import { MainMenu } from './main-menu'
import { SelectTeamDropdown } from './select-team-dropdown'
import { UserMenuDropdown } from './user-menu-dropdown'

export const Header = async () => {
  const user = await usersQueries.findMe()

  return (
    <header className="p-4 border-b flex items-center justify-between h-20">
      <div className="h-full flex items-center gap-6">
        <Link href="/" className="h-full">
          <Logo />
        </Link>
        <MainMenu />
      </div>

      <div className="flex items-center gap-4">
        <SelectTeamDropdown user={user} />
        <UserMenuDropdown user={user} />
      </div>
    </header>
  )
}
