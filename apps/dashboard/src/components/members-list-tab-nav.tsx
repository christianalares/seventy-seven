'use client'

import { cn } from '@seventy-seven/ui/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const MembersListTabNav = () => {
  const pathname = usePathname()

  return (
    <nav className="text-sm">
      <ul className="flex items-center gap-2">
        <li className="relative">
          <Link
            href="/settings/members"
            className={cn({
              'text-foreground': pathname === '/settings/members',
              'text-muted-foreground': pathname !== '/settings/members',
            })}
          >
            Team Members
          </Link>

          {pathname === '/settings/members' && (
            <motion.div
              layoutId="account-sub-nav-underline"
              className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-muted-foreground"
            />
          )}
        </li>

        <li className="relative">
          <Link
            href="/settings/members/pending"
            className={cn({
              'text-foreground': pathname === '/settings/members/pending',
              'text-muted-foreground': pathname !== '/settings/members/pending',
            })}
          >
            Pending
          </Link>

          {pathname === '/settings/members/pending' && (
            <motion.div
              layoutId="account-sub-nav-underline"
              className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-muted-foreground"
            />
          )}
        </li>
      </ul>
    </nav>
  )
}
