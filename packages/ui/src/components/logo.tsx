import { cn } from '../utils'

type Props = {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <span
      className={cn(
        'inline-flex justify-center items-center size-12 font-bold bg-foreground text-background rounded-lg text-2xl -tracking-[3px]',
        className,
      )}
    >
      77
    </span>
  )
}
