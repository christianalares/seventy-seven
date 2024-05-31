import {
  AlarmClock,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  CircleAlert,
  CircleDashed,
  ClipboardCheck,
  ClipboardCopy,
  Dot,
  ExternalLink,
  Filter,
  FilterX,
  Home,
  Inbox,
  Info,
  List,
  ListOrdered,
  Loader2,
  type LucideProps,
  Mail,
  MailOpen,
  MailQuestion,
  Menu,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Plus,
  ScrollText,
  Search,
  Send,
  Settings,
  Settings2,
  Shapes,
  Star,
  Sun,
  Tag,
  Trash2,
  TriangleAlert,
  User,
  UserPlus,
  UserX,
  X,
} from 'lucide-react'
import type { ComponentProps } from 'react'

const Github = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" {...props}>
      <title>Github</title>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.21.22C5.412.22.71 5.038.71 10.984c0 4.757 3.009 8.792 7.18 10.216.525.1.718-.234.718-.518 0-.257-.01-1.105-.014-2.005-2.921.652-3.538-1.27-3.538-1.27-.477-1.244-1.165-1.575-1.165-1.575-.953-.668.071-.655.071-.655 1.055.076 1.61 1.11 1.61 1.11.936 1.646 2.456 1.17 3.056.895.094-.696.366-1.171.666-1.44-2.332-.272-4.784-1.195-4.784-5.32 0-1.176.41-2.136 1.082-2.89-.109-.271-.468-1.366.102-2.85 0 0 .882-.288 2.888 1.105a9.833 9.833 0 0 1 2.628-.363 9.857 9.857 0 0 1 2.63.363c2.005-1.393 2.885-1.104 2.885-1.104.572 1.483.212 2.578.103 2.849.674.754 1.08 1.714 1.08 2.89 0 4.135-2.455 5.045-4.794 5.312.377.334.712.989.712 1.993 0 1.44-.011 2.6-.011 2.955 0 .286.188.622.72.516 4.17-1.425 7.175-5.459 7.175-10.214 0-5.946-4.7-10.766-10.5-10.766Z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M4.687 15.677c-.023.053-.105.07-.18.033-.076-.036-.119-.109-.094-.162.023-.055.105-.07.18-.034.077.035.12.109.094.163Zm.425.486c-.05.047-.148.025-.214-.05-.069-.075-.082-.176-.03-.224.05-.047.146-.025.214.05.07.076.083.176.03.224Zm.414.62c-.064.046-.17.003-.234-.093-.065-.096-.065-.21.001-.257.065-.046.17-.004.235.09.064.098.064.213-.002.26Zm.568.599c-.058.065-.18.047-.27-.041-.092-.087-.117-.21-.06-.275.058-.066.182-.047.272.04.091.087.119.211.058.276Zm.782.348c-.026.084-.143.122-.262.087-.12-.037-.197-.136-.173-.221.025-.085.143-.125.263-.087.119.037.197.135.172.22Zm.86.064c.002.09-.098.163-.223.164-.126.003-.228-.069-.229-.156 0-.09.099-.162.224-.165.125-.002.228.07.228.157Zm.799-.139c.015.086-.072.175-.196.199-.122.023-.235-.03-.25-.116-.015-.09.073-.178.195-.201.124-.022.235.03.25.118Z"
      />
    </svg>
  )
}

const Google = (props: ComponentProps<'svg'>) => {
  return (
    <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <g clipPath="url(#a)">
        <path
          d="M10 3.958c1.475 0 2.796.509 3.838 1.5l2.854-2.854C14.959.992 12.696 0 10 0a9.995 9.995 0 0 0-8.933 5.508l3.325 2.58c.787-2.371 3-4.13 5.608-4.13Z"
          fill="#585858"
        />
        <path
          d="M19.575 10.23c0-.655-.063-1.288-.158-1.897H10v3.759h5.392a4.648 4.648 0 0 1-1.992 2.991l3.22 2.5c1.88-1.741 2.955-4.316 2.955-7.354Z"
          fill="#878787"
        />
        <path
          d="M4.388 11.912A6.075 6.075 0 0 1 4.07 10c0-.667.112-1.308.317-1.913L1.063 5.508A9.964 9.964 0 0 0 0 10c0 1.617.383 3.142 1.067 4.492l3.32-2.58Z"
          fill="#D7D7D7"
        />
        <path
          d="M10 20c2.7 0 4.97-.887 6.62-2.42l-3.22-2.5c-.896.603-2.05.958-3.4.958-2.608 0-4.82-1.759-5.612-4.13l-3.325 2.58C2.712 17.758 6.091 20 10 20Z"
          fill="#B3B3B3"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

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
  chevronRight: ChevronRight,
  loader: Loader2,
  moreVertical: MoreVertical,
  moreHorizontal: MoreHorizontal,
  settings: Settings,
  settings2: Settings2,
  clipboardCopy: ClipboardCopy,
  clipboardCheck: ClipboardCheck,
  check: Check,
  checkCircle: CheckCircle,
  checkCircle2: CheckCircle2,
  send: Send,
  alarmClock: AlarmClock,
  scrollText: ScrollText,
  trash: Trash2,
  externalLink: ExternalLink,
  star: Star,
  listOrdered: ListOrdered,
  userX: UserX,
  userPlus: UserPlus,
  circle: Circle,
  circleDashed: CircleDashed,
  plus: Plus,
  minus: Minus,
  filter: Filter,
  github: Github,
  google: Google,
  user: User,
  circleAlert: CircleAlert,
  tag: Tag,
  info: Info,
  search: Search,
  mailQuestion: MailQuestion,
  filterX: FilterX,
  triangleAlert: TriangleAlert,
  shapes: Shapes,
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
