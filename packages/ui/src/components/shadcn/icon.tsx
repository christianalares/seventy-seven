import {
  Calendar,
  Check,
  ChevronsUpDown,
  ClipboardCheck,
  ClipboardCopy,
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
  Send,
  Settings,
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
  settings: Settings,
  clipboardCopy: ClipboardCopy,
  clipboardCheck: ClipboardCheck,
  check: Check,
  send: Send,
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
