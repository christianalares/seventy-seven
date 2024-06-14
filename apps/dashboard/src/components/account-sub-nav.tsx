'use client'

import { cn } from '@seventy-seven/ui/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'

type SubLinkItemProps = {
  href: string
  label: string
}

const SubLinkItem = ({ href, label }: SubLinkItemProps) => {
  const segment = useSelectedLayoutSegment()
  const pathname = usePathname()

  const isActive = (href === '/account' && segment === null) || pathname === href

  return (
    <li className="relative">
      <Link
        prefetch
        href={href}
        className={cn('transition-colors', {
          'text-foreground': isActive,
          'text-muted-foreground': !isActive,
        })}
      >
        {label}
      </Link>
      {isActive && (
        <motion.div
          layoutId="account-sub-nav-underline"
          className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-muted-foreground"
        />
      )}
    </li>
  )
}

export const AccountSubNav = () => {
  return (
    <nav>
      <ul className="flex items-center gap-3">
        <SubLinkItem href="/account" label="General" />
        <SubLinkItem href="/account/teams" label="Teams" />
        <SubLinkItem href="/account/notifications" label="Notifications" />
      </ul>
    </nav>
  )
}
