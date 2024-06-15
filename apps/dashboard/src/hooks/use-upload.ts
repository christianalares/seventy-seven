import { createClient } from '@seventy-seven/supabase/clients/client'
import { useState } from 'react'

export const BUCKETS = ['team-avatars'] as const
type Bucket = (typeof BUCKETS)[number]

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false)

  const supabase = createClient()

  const uploadFile = async ({ bucket, path, file }: { bucket: Bucket; path: string[]; file: File }) => {
    setIsUploading(true)

    const storage = supabase.storage.from(bucket)

    const result = await storage.upload(path.join('/'), file, {
      upsert: true,
      cacheControl: '3600',
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    const {
      data: { publicUrl },
    } = storage.getPublicUrl(path.join('/'))

    setIsUploading(false)

    return {
      url: publicUrl,
    }
  }

  return {
    uploadFile,
    isUploading,
  }
}
