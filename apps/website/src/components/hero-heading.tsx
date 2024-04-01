// import { cn } from '@seventy-seven/ui/utils'
// import { useTheme } from 'next-themes'
import Balancer from 'react-wrap-balancer'

export const HeroHeading = () => {
  return (
    <h1 className="leading-none [font-size:clamp(1.875rem,7vw,4.5rem)] text-center mt-16 font-maven-pro font-semibold">
      <Balancer
      // className={cn('text-transparent bg-clip-text bg-gradient-to-r inline-block from-foreground to-[#838383]', {
      // 'from-foreground via-[#505050] to-foreground': resolvedTheme === 'light',
      // 'from-[#a0a0a0] via-foreground to-[#a0a0a0]': resolvedTheme === 'dark',
      // })}
      >
        The open-source
        <br />
        alternative to Zendesk
      </Balancer>
    </h1>
  )
}
