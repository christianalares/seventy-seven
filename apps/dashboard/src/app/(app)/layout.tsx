import { SetProfileId } from '@openpanel/nextjs'
import { getUser } from '@seventy-seven/supabase/session'

type Props = {
  authed: React.ReactNode
  unauthed: React.ReactNode
}

const AppLayout = async ({ authed, unauthed }: Props) => {
  const user = await getUser()

  return user ? (
    <>
      <SetProfileId value={user.id} />
      {authed}
    </>
  ) : (
    unauthed
  )
}

export default AppLayout
