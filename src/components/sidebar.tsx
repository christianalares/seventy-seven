'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment, useSelectedLayoutSegments } from 'next/navigation'
import { Icon, type IconName } from './ui/icon'
import { SheetClose } from './ui/sheet'

type LinkItemProps = {
  href: string
  label: string
  icon?: IconName
  inDrawer?: boolean
}

const LinkItem = ({ href, label, icon, inDrawer }: LinkItemProps) => {
  const segment = useSelectedLayoutSegment()

  const pathname = usePathname()

  const isActive = (segment === null && href === '/') || pathname === href

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
        {inDrawer ? (
          <SheetClose className="flex items-center gap-2 flex-1">
            {icon && <Icon className="size-4" name={icon} />}
            {label}
          </SheetClose>
        ) : (
          <>
            {icon && <Icon className="size-4" name={icon} />}
            {label}
          </>
        )}
      </Link>
    </li>
  )
}

type Props = {
  className?: string
  inDrawer?: boolean
}
export const Sidebar = ({ className, inDrawer }: Props) => {
  return (
    <aside
      className={cn(
        'border-r p-3',
        {
          'border-0': inDrawer,
        },
        className,
      )}
    >
      <nav>
        <ul className="flex flex-col gap-2">
          <LinkItem inDrawer={inDrawer} href="/" icon="home" label="Overview" />
          <LinkItem inDrawer={inDrawer} href="/inbox" icon="inbox" label="Inbox" />
        </ul>
      </nav>
    </aside>
  )
}
