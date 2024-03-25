'use client'

import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@seventy-seven/ui/icon'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'

type LinkItemProps = {
  href: string
  label: string
  icon?: IconName
}

const LinkItem = ({ href, label, icon }: LinkItemProps) => {
  const segment = useSelectedLayoutSegment()

  const pathname = usePathname()

  const isActive =
    (segment === null && href === '/') || pathname === href || (href === '/inbox' && segment === 'ticket')

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

type Props = {
  className?: string
}

export const Sidebar = ({ className }: Props) => {
  return (
    <aside className={cn('border-r p-3', className)}>
      <nav>
        <ul className="flex flex-col gap-2">
          <LinkItem href="/" icon="home" label="Overview" />
          <LinkItem href="/inbox" icon="inbox" label="Inbox" />
          <LinkItem href="/settings" icon="settings" label="Settings" />
        </ul>
      </nav>
    </aside>
  )
}
