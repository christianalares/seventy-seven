import { folderSchema } from '@/queries/tickets'
import { parseAsStringEnum, useQueryState } from 'nuqs'

const useFolderFilter = () => {
  // Extract the literals from the schema
  const folders = folderSchema._def.options.map((option) => option._def.value)

  const [folderFilter, setFolderFilter] = useQueryState(
    'folder',
    parseAsStringEnum(folders).withOptions({
      // Notify RSCs
      shallow: false,
    }),
  )

  return { folderFilter, setFolderFilter }
}

export default useFolderFilter
