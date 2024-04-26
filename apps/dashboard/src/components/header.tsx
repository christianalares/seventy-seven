import { usersQueries } from '@/queries/users'
import { prisma } from '@seventy-seven/orm/prisma'
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

      <form
        action={async () => {
          'use server'
          console.log('start')

          const message = await prisma.message.create({
            data: {
              ticket_id: '5d013713-9e5d-4106-bdaa-995fa1624803',
              body: 'TEST 123',
              sent_from_full_name: 'Test Testsson',
            },
          })

          console.log(message)
        }}
      >
        <button type="submit">Random message</button>
      </form>

      <UserMenuDropdown className="ml-auto" user={user} />
    </header>
  )
}
