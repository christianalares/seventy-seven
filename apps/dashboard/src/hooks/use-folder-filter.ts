import { parseAsStringEnum, useQueryState } from 'nuqs'

const useFolderFilter = () => {
  const [folderFilter, setFolderFilter] = useQueryState(
    'folder',
    parseAsStringEnum(['all', 'snoozed', 'drafts', 'responded', 'closed']).withOptions({
      // Notify RSCs
      shallow: false,
    }),
  )

  return { folderFilter, setFolderFilter }
}

export default useFolderFilter
