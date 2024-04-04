import {
  AlarmClock,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  ClipboardCheck,
  ClipboardCopy,
  Dot,
  FolderClosed,
  FolderOpen,
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
  MoreHorizontal,
  MoreVertical,
  ScrollText,
  Send,
  Settings,
  Sun,
  Trash2,
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
  chevronDown: ChevronDown,
  loader: Loader2,
  moreVertical: MoreVertical,
  moreHorizontal: MoreHorizontal,
  settings: Settings,
  clipboardCopy: ClipboardCopy,
  clipboardCheck: ClipboardCheck,
  check: Check,
  checkCircle: CheckCircle,
  checkCircle2: CheckCircle2,
  send: Send,
  folderOpen: FolderOpen,
  folderClosed: FolderClosed,
  alarmClock: AlarmClock,
  scrollText: ScrollText,
  trash: Trash2,
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
