import { Calendar, Dot, Home, Inbox, List, type LucideProps, Mail, MailOpen, Menu, X } from 'lucide-react'

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
