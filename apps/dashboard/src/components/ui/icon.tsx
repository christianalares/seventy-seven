import {
  Calendar,
  ChevronsUpDown,
  Cog,
  Dot,
  Home,
  Inbox,
  List,
  Loader2,
  type LucideProps,
  Mail,
  MailOpen,
  Menu,
  Monitor,
  Moon,
  MoreVertical,
  Sun,
  X,
} from 'lucide-react'

const icons = {
  dot: Dot,
  close: X,
  mail: Mail,
  mailOpen: MailOpen,
  home: Home,
  inbox: Inbox,
  list: List,
  menu: Menu,
  calendar: Calendar,
  moon: Moon,
  sun: Sun,
  monitor: Monitor,
  chevronsUpDown: ChevronsUpDown,
  loader: Loader2,
  moreVertical: MoreVertical,
  cog: Cog,
}

export type IconName = keyof typeof icons

type IconProps = {
  name: IconName
  className?: string
} & LucideProps

export const Icon = ({ name, className, ...restProps }: IconProps) => {
  const IconComponent = icons[name]

  return <IconComponent className={className} {...restProps} />
}
