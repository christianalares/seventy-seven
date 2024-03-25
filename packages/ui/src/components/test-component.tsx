import { cn } from '../utils'

type Props = {
  className?: string
}

export const TestComponent = ({ className }: Props) => {
  return <p className={cn('text-red-400', className)}>Hello!!!!</p>
}
