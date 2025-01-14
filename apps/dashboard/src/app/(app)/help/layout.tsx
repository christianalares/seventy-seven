import { HydrateClient, trpc } from '@/trpc/server'

type Props = {
  children: React.ReactNode
}

const HelpLayout = ({ children }: Props) => {
  trpc.users.me.prefetch()

  return (
    <HydrateClient>
      <main className="overflow-y-scroll">{children}</main>
    </HydrateClient>
  )
}

export default HelpLayout
