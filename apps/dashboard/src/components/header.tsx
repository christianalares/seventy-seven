import { usersQueries } from '@/queries/users'
import { Logo } from '@seventy-seven/ui/logo'
import Link from 'next/link'
import { UserMenuDropdown } from './user-menu-dropdown'

export const Header = async () => {
  const user = await usersQueries.findMe()

  return (
    <header className="p-4 border-b h-20 flex items-center">
      <Link href="/" className="h-full">
        <Logo />
      </Link>

      <UserMenuDropdown className="ml-auto" user={user} />
    </header>
  )
}
