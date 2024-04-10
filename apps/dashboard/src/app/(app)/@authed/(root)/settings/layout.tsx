import { SettingsSubNav } from '@/components/settings-sub-nav'

type Props = {
  children: React.ReactNode
}

const SettingsLayout = ({ children }: Props) => {
  return (
    <div className="m-8">
      <h1 className="text-2xl">Team settings</h1>
      <SettingsSubNav className="mt-8" />

      <div className="mt-8">{children}</div>
    </div>
  )
}

export default SettingsLayout
