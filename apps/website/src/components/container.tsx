import { cn } from '@seventy-seven/ui/utils'

type Props = {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export const Container = ({ children, as: As = 'div', className }: Props) => (
  <As className={cn('mx-auto w-full max-w-[1440px] px-4 md:px-8', className)}>{children}</As>
)
