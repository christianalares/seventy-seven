'use client'

import { type FolderType, getIconStyle } from '@/utils/get-icon-style'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type LinkItemProps = {
  href: string
  label: string
  type: FolderType
}

const LinkItem = ({ href, label, type }: LinkItemProps) => {
  const segment = useSelectedLayoutSegment()

  // TODO: Add isActive when we have the routes in place
  const _isActive = (segment === null && href === '/') || segment === href.substring(1)
  const icon = getIconStyle(type)

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
