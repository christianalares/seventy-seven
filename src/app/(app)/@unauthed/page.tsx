import { SignInWithGithubButton } from '@/components/sign-in-with-github-button'

const UnauthorizedPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignInWithGithubButton />
    </div>
  )
}

export default UnauthorizedPage
