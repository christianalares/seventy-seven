import { usersQueries } from '@/queries/users'
import { Logo } from '@seventy-seven/ui/logo'

const ClosedPage = async () => {
  const user = await usersQueries.findMaybeMe()

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="border p-8 rounded-md bg-foreground/5 shadow-lg max-w-md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4">
            <Logo className="size-16" />
            <span className="text-6xl">⏳</span>
          </div>
          {user ? (
            <h1 className="text-3xl font-maven-pro">Welcome, {user.full_name}!</h1>
          ) : (
            <h1 className="text-3xl font-maven-pro">Welcome to Seventy Seven!</h1>
          )}
        </div>

        <div className="space-y-4 mt-4">
          <p>Seventy Seven is not yet open to the public.</p>
          <p>
            Until then, feel free to follow me on 𝕏 to keep you up to date about the progress:{' '}
            <a href="https://twitter.com/c_alares" target="_blank" rel="noreferrer" className="text-blue-500">
              @c_alares
            </a>
            , I'll frequently post updates about our progress.
          </p>

          <p>
            If you want to lurk around in the code, feel free to visit{' '}
            <a href="https://git.new/seventy-seven" target="_blank" rel="noreferrer" className="text-blue-500">
              the github repo
            </a>{' '}
            and maybe give it a star while you're there!
          </p>

          <p>
            See you soon!
            <br />
            <span className="italic">Christian</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClosedPage
