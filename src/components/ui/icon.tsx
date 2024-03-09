import { Dot, Home, Inbox, type LucideProps, Mail, MailOpen, Menu, PanelRightOpen, X } from 'lucide-react'

const icons = {
  dot: Dot,
  close: X,
  mail: Mail,
  mailOpen: MailOpen,
  home: Home,
  inbox: Inbox,
  panelRightOpen: PanelRightOpen,
  menu: Menu,
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
