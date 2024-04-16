import { SignInWithGithubButton } from '@/components/sign-in-with-github-button'

type Props = {
  searchParams: {
    returnTo?: string
  }
}

const UnauthorizedPage = ({ searchParams }: Props) => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignInWithGithubButton returnTo={searchParams.returnTo} />
    </div>
  )
}

export default UnauthorizedPage
