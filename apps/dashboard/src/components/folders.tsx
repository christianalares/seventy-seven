'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon, type IconName } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

const folderTypes = ['snoozed', 'drafts', 'responded', 'closed', 'folder'] as const
type FolderType = (typeof folderTypes)[number]

type LinkItemProps = {
  href: string
  label: string
  type: FolderType
}

const r = (name: IconName, className: string) => ({ name, className })

const getIcon = (type: FolderType): ReturnType<typeof r> => {
  switch (type) {
    case 'snoozed':
      return r('alarmClock', 'text-orange-500')
    case 'drafts':
      return r('scrollText', 'text-blue-500')
    case 'responded':
      return r('send', 'text-green-500')
    case 'closed':
      return r('checkCircle', 'text-destructive')
    default:
      return r('folderClosed', 'text-primary')
  }
}

const LinkItem = ({ href, label, type }: LinkItemProps) => {
  const segment = useSelectedLayoutSegment()

  // TODO: Add isActive when we have the routes in place
  const _isActive = (segment === null && href === '/') || segment === href.substring(1)
  const icon = getIcon(type)

  return (
    <li>
      <Button asChild size="xs" variant="ghost" className="flex justify-start gap-2">
        <Link href={href}>
          <Icon name={icon.name} className={cn('size-4', icon.className)} />
          <span className="sr-only md:not-sr-only">{label}</span>
        </Link>
      </Button>
    </li>
  )
}

type Props = {
  className?: string
}

export const Folders = ({ className }: Props) => {
  return (
    <div className={cn(className)}>
      <ul className="flex flex-col gap-1">
        <LinkItem href="/folders/1" type="snoozed" label="Snoozed" />
        <LinkItem href="/folders/2" type="drafts" label="Drafts" />
        <LinkItem href="/folders/3" type="responded" label="Responded" />
        <LinkItem href="/folders/4" type="closed" label="Closed" />
      </ul>
    </div>
  )
}
