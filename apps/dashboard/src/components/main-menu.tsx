'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon, type IconName } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type LinkItemProps = {
  href: string
  label: string
  icon?: IconName
  className?: string
}

const LinkItem = ({ href, label, icon, className }: LinkItemProps) => {
  const segment = useSelectedLayoutSegment()
  const isActive = (segment === null && href === '/') || segment === href.substring(1)

  return (
    <li className={cn(className)}>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className={cn('gap-2 text-muted-foreground flex justify-start', {
          'text-foreground bg-accent': isActive,
        })}
      >
        <Link href={href}>
          {icon && <Icon className="size-4" name={icon} />}
          <span className="sr-only sm:not-sr-only">{label}</span>
        </Link>
      </Button>
    </li>
  )
}

type Props = {
  className?: string
}

export const MainMenu = ({ className }: Props) => {
  return (
    <nav className={cn(className)}>
      <ul className="flex items-center gap-2">
        {/* <LinkItem href="/" icon="home" label="Overview" /> */}
        <LinkItem href="/inbox" icon="inbox" label="Inbox" />
        <LinkItem href="/settings" icon="settings" label="Settings" />
        <LinkItem href="/help" icon="info" label="Help" className="ml-auto" />
      </ul>
    </nav>
  )
}
