import { getSession } from '@seventy-seven/supabase/session'
import Link from 'next/link'
import { Logo } from './ui/logo'
import { UserMenuDropdown } from './user-menu-dropdown'

export const Header = async () => {
  const session = await getSession()

  if (!session) {
    return null
  }

  return (
    <header className="p-4 border-b h-20 flex items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:skew-x-12 transition-transform duration-300">
          <Logo />
        </Link>
      </div>

      <UserMenuDropdown className="ml-auto" user={session.user} />
    </header>
  )
}
