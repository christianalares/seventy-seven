'use client'

import { type FolderType, getIconStyle } from '@/utils/get-icon-style'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

type LinkItemProps = {
  href: string
  label: string
  type?: FolderType
  isActive: boolean
}

const LinkItem = ({ href, label, type, isActive }: LinkItemProps) => {
  const icon = getIconStyle(type)

  return (
    <li>
      <Button
        asChild
        size="xs"
        variant="ghost"
        className={cn('flex justify-start gap-2', {
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

  return (
    <div className={cn(className)}>
      <ul className="flex flex-col gap-1">
        <LinkItem isActive={segments[1] === '(root)'} href="/inbox" label="All" />
        <LinkItem isActive={segments[1] === '(snoozed)'} href="/inbox/snoozed" type="snoozed" label="Snoozed" />
        <LinkItem isActive={segments[1] === '(drafts)'} href="/inbox/drafts" type="drafts" label="Drafts" />
        <LinkItem isActive={segments[1] === '(responded)'} href="/inbox/responded" type="responded" label="Responded" />
        <LinkItem isActive={segments[1] === '(closed)'} href="/inbox/closed" type="closed" label="Closed" />
      </ul>
    </div>
  )
}
