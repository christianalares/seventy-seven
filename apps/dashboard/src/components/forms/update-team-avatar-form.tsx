'use client'

import { updateTeamAvatar } from '@/actions/teams'
import { useUpload } from '@/hooks/use-upload'
import type { UsersFindMe } from '@/queries/users'
import { imageTypeSchema } from '@/utils/validation/common'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { useAction } from 'next-safe-action/hooks'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  currentTeam: UsersFindMe['current_team']
}

export const UpdateTeamAvatarForm = ({ currentTeam }: Props) => {
  const pathname = usePathname()
  const { isUploading, uploadFile } = useUpload()
  const [avatarImage, setAvatarImage] = useState(currentTeam.image_url ?? undefined)
  const [errorMessage, setErrorMessage] = useState<string>()

  const action = useAction(updateTeamAvatar, {
    onSuccess: () => {
      setErrorMessage(undefined)
      toast.success('Team avatar updated')
    },
    onError: (error) => {
      setErrorMessage(error.serverError ?? 'Failed to update team avatar')
    },
  })

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]

    if (!file) {
      return
    }

    const parsedImageType = imageTypeSchema.safeParse(file.type)

    if (!parsedImageType.success) {
      setErrorMessage('File must be an image')
      return
    }

    setAvatarImage(URL.createObjectURL(file))

    try {
      const { url } = await uploadFile({
        bucket: 'team-avatars',
        path: [currentTeam.id, file.name],
        file: file,
      })

      action.execute({
        revalidatePath: pathname,
        avatarUrl: url,
      })

      setAvatarImage(url)
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      }
    }
  }

  const isLoading = isUploading || action.status === 'executing'

  return (
    <Card>
      <div className="flex justify-between">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="image" />
            Team Avatar
          </CardTitle>
          <CardDescription>
            Your team avatar will be visible in emails sent to your users and displayed in across the UI in this
            dashboard.
            <ErrorMessage message={errorMessage} />
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-12">
          <label
            className={cn('relative cursor-pointer block size-12 rounded-full transition-transform', {
              'hover:scale-110 outline-1 outline-dashed outline-primary outline-offset-2': !isLoading,
              'opacity-70 cursor-not-allowed': isLoading,
            })}
          >
            {isLoading && (
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full outline-1 outline-dashed outline-primary outline-offset-2 animate-spin"
                style={{
                  animationDuration: '10s',
                }}
              />
            )}

            {avatarImage ? (
              <Image
                className="size-full rounded-full"
                src={avatarImage}
                alt={currentTeam.name}
                width={100}
                height={100}
              />
            ) : (
              <div className="size-full flex justify-center items-center">
                <Icon name="image" className="text-gray-400" />
              </div>
            )}
            <input
              disabled={isLoading}
              type="file"
              name="file"
              className="hidden"
              multiple={false}
              onChange={handleOnChange}
            />
          </label>
        </CardContent>
      </div>

      <CardFooter className="justify-between">
        <p>A team avatar is not required but recommended</p>
      </CardFooter>
    </Card>
  )
}

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) {
    return null
  }

  return <p className="text-xs text-destructive mt-2">{message}</p>
}
