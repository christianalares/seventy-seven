import { getSession } from '@/utils/supabase/session'

type Props = {
  authed: React.ReactNode
  unauthed: React.ReactNode
}

const AppLayout = async ({ authed, unauthed }: Props) => {
  const session = await getSession()

  return session ? authed : unauthed
}

export default AppLayout
