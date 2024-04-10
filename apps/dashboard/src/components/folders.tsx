'use client'

import type { Folder } from '@/queries/tickets'
import { getIconStyle } from '@/utils/get-icon-style'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

type LinkItemProps = {
  label: string
  type?: Folder
  href: string
  isActive: boolean
}

const FolderFilterButton = ({ label, type, href, isActive }: LinkItemProps) => {
  const icon = getIconStyle(type)

  return (
    <li>
      <Button
        asChild
        size="xs"
        variant="ghost"
        className={cn('gap-2 w-full justify-start', {
          'text-foreground bg-accent': isActive,
        })}
      >
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
  const segments = useSelectedLayoutSegments()
  const joinedSegments = segments.join('.')

  return (
    <div className={cn(className)}>
      <ul className="flex flex-col gap-1">
        <FolderFilterButton isActive={joinedSegments === 'inbox.all'} href="/inbox" label="All" />
        <FolderFilterButton
          isActive={joinedSegments.startsWith('inbox.unhandled')}
          href="/inbox/unhandled"
          type="unhandled"
          label="Unhandled"
        />
        <FolderFilterButton
          isActive={joinedSegments === 'inbox.starred'}
          href="/inbox/starred"
          type="starred"
          label="Starred"
        />
        <FolderFilterButton
          isActive={joinedSegments.startsWith('inbox.snoozed')}
          href="/inbox/snoozed"
          type="snoozed"
          label="Snoozed"
        />
        <FolderFilterButton
          isActive={joinedSegments.startsWith('inbox.closed')}
          href="/inbox/closed"
          type="closed"
          label="Closed"
        />
      </ul>
    </div>
  )
}
