import { SignInWithGithubButton } from '@/components/sign-in-buttons/sign-in-with-github-button'
import { SignInWithGoogleButton } from '@/components/sign-in-buttons/sign-in-with-google-button'
import { Logo } from '@seventy-seven/ui/logo'

type Props = {
  searchParams: {
    returnTo?: string
  }
}

const UnauthorizedPage = ({ searchParams }: Props) => {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="border p-8 rounded-md bg-foreground/5 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <Logo className="size-16" />
          <h1 className="text-3xl font-maven-pro">Welcome to 77</h1>
        </div>

        <div className="space-y-4 mt-8">
          <SignInWithGithubButton returnTo={searchParams.returnTo} />
          <SignInWithGoogleButton returnTo={searchParams.returnTo} />
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
