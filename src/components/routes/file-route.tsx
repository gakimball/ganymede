import { useRoute } from 'preact-iso'
import { useStore } from '../../state/use-store'
import { useEffect } from 'preact/hooks'
import { ErrorLayout } from '../layouts/error-layout'
import { EmptyLayout } from '../layouts/empty-layout'
import { DatabaseLayout } from '../layouts/database-layout'
import { TextLayout } from '../layouts/text-layout'
import { FolderLayout } from '../layouts/folder-layout'

export const FileRoute = () => {
  const { files } = useStore()
  const { path } = useRoute().query
  const currentFile = files.current.value

  useEffect(() => {
    if (path) {
      files.openFileByPath(path)
    }
  }, [files, path])

  if (!currentFile) {
    return <EmptyLayout />
  }

  if (currentFile.hasError) {
    return <ErrorLayout />
  }

  if (currentFile.type === 'database') {
    return <DatabaseLayout {...currentFile} />
  }

  if (currentFile.type === 'folder') {
    return <FolderLayout {...currentFile} />
  }

  return <TextLayout {...currentFile} />
}
