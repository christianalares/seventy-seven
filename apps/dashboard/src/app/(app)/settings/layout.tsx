import { SettingsSubNav } from '@/components/settings-sub-nav'
import { HydrateClient, trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
}

const SettingsLayout = ({ children }: Props) => {
  trpc.users.me.prefetch()

  return (
    <HydrateClient>
      <main className="overflow-y-scroll">
        <div className="m-4 md:m-8">
          <h1 className="text-2xl">Team settings</h1>
          <SettingsSubNav className="mt-8" />

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </HydrateClient>
  )
}

export default SettingsLayout
