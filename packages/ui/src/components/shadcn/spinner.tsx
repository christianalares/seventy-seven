import { cn } from '../../utils'
import { Icon } from './icon'

type Props = {
  className?: string
}

export const Spinner = ({ className }: Props) => {
  return <Icon name="loader" className={cn('animate-spin', className)} />
}
