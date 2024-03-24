import { SettingsSubNav } from '@/components/settings-sub-nav'

type Props = {
  children: React.ReactNode
}

const SettingsLayout = ({ children }: Props) => {
  return (
    <div className="m-8">
      <SettingsSubNav />

      <div className="mt-8">{children}</div>
    </div>
  )
}

export default SettingsLayout
