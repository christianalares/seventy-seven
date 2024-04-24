import { cn } from '@seventy-seven/ui/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export const PageWrapper = ({ children, className }: Props) => {
  return <div className={cn('max-w-3xl', className)}>{children}</div>
}
