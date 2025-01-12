'use client'

import { useUpload } from '@/hooks/use-upload'
import { trpc } from '@/trpc/client'
import { imageTypeSchema } from '@/utils/validation/common'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const UpdateTeamAvatarForm = () => {
  const [me] = trpc.users.me.useSuspenseQuery()
  const trpcUtils = trpc.useUtils()

  const updateTeamAvatarMutation = trpc.teams.updateAvatar.useMutation({
    onSuccess: () => {
      trpcUtils.users.me.invalidate()

      setErrorMessage(undefined)
      toast.success('Team avatar updated')
    },
    onError: (error) => {
      setErrorMessage(error.message ?? 'Failed to update team avatar')
    },
  })

  const { isUploading, uploadFile } = useUpload()
  const [avatarImage, setAvatarImage] = useState(me.current_team.image_url ?? undefined)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    setAvatarImage(me.current_team.image_url ?? undefined)
  }, [me.current_team.image_url])

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
        path: [me.current_team.id, file.name],
        file,
      })

      updateTeamAvatarMutation.mutate({
        avatarUrl: url,
      })

      setAvatarImage(url)
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      }
    }
  }

  const isLoading = isUploading || updateTeamAvatarMutation.isPending

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
                className="size-full rounded-full object-cover"
                src={avatarImage}
                alt={me.current_team.name}
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
