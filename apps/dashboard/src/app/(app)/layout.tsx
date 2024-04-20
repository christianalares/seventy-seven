import { getUser } from '@seventy-seven/supabase/session'

type Props = {
  authed: React.ReactNode
  unauthed: React.ReactNode
}

const AppLayout = async ({ authed, unauthed }: Props) => {
  const user = await getUser()

  return user ? authed : unauthed
}

export default AppLayout
