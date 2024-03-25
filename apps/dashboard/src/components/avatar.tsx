import { AvatarFallback, AvatarImage, Avatar as AvatarPrimitive } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type Props = {
  imageUrl?: string
  name: string
  className?: string
}

export const Avatar = ({ imageUrl, name, className }: Props) => {
  const fullnameParts = name.split(' ')
  // @ts-ignore
  let initials = fullnameParts[0].charAt(0).toUpperCase()

  if (fullnameParts.length >= 2) {
    // @ts-ignore
    initials = (fullnameParts[0].charAt(0) + fullnameParts[fullnameParts.length - 1].charAt(0)).toUpperCase()
  }

  if (fullnameParts.length === 1) {
    // @ts-ignore
    initials = `${fullnameParts[0].charAt(0).toUpperCase()}${fullnameParts[0].charAt(1).toUpperCase()}`
  }

  return (
    <AvatarPrimitive className={cn(className)}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </AvatarPrimitive>
  )
}
