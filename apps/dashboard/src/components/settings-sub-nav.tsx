'use client'

import { cn } from '@seventy-seven/ui/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type SubLinkItemProps = {
  href: string
  label: string
  isActive: boolean
}

const SubLinkItem = ({ href, label, isActive }: SubLinkItemProps) => {
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
          layoutId="settings-sub-nav-underline"
          className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-muted-foreground"
        />
      )}
    </li>
  )
}

type Props = {
  className?: string
}

export const SettingsSubNav = ({ className }: Props) => {
  const segment = useSelectedLayoutSegment()

  return (
    <nav className={cn(className)}>
      <ul className="flex items-center gap-4">
        <SubLinkItem isActive={segment === null} href="/settings" label="General" />
        <SubLinkItem isActive={segment === 'members'} href="/settings/members" label="Members" />
        <SubLinkItem isActive={segment === 'tags'} href="/settings/tags" label="Tags" />
        <SubLinkItem isActive={segment === 'integrations'} href="/settings/integrations" label="Integrations" />
        <SubLinkItem isActive={segment === 'security'} href="/settings/security" label="Security" />
      </ul>
    </nav>
  )
}
