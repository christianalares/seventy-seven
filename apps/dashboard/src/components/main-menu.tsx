'use client'

import { Icon, type IconName } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type LinkItemProps = {
  href: string
  label: string
  icon?: IconName
}

const LinkItem = ({ href, label, icon }: LinkItemProps) => {
  const segment = useSelectedLayoutSegment()
  const isActive = (segment === null && href === '/') || segment === href.substring(1)

  return (
    <li>
      <Link
        href={href}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 hover:bg-foreground/5 border border-transparent hover:border-border text-foreground/60 text-sm',
          {
            'bg-foreground/5 border-border text-foreground': isActive,
          },
        )}
      >
        {icon && <Icon className="size-4" name={icon} />}
        <span className="sr-only md:not-sr-only">{label}</span>
      </Link>
    </li>
  )
}

export const MainMenu = () => {
  return (
    <nav>
      <ul className="flex flex-col gap-2">
        <LinkItem href="/" icon="home" label="Overview" />
        <LinkItem href="/inbox" icon="inbox" label="Inbox" />
        <LinkItem href="/settings" icon="settings" label="Settings" />
      </ul>
    </nav>
  )
}
