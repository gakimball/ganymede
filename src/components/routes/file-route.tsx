import { useStore } from '../../state/use-store'
import { useEffect } from 'preact/hooks'
import { ErrorLayout } from '../layouts/error-layout'
import { EmptyLayout } from '../layouts/empty-layout'
import { DatabaseLayout } from '../layouts/database-layout'
import { TextLayout } from '../layouts/text-layout'
import { FolderLayout } from '../layouts/folder-layout'
import { FileBreadcrumbs } from '../common/file-breadcrumbs'
import { FunctionComponent } from 'preact'

interface FileRouteProps {
  path: string;
  view: string | null;
}

export const FileRoute: FunctionComponent<FileRouteProps> = ({
  path,
  view,
}) => {
  const { files } = useStore()
  const currentFile = files.current.value
  const directory = files.directory.value

  useEffect(() => {
    if (typeof path === 'string') {
      files.openFileByPath(path)
    }
  }, [files, path])

  if (!currentFile) {
    return <EmptyLayout />
  }

  return (
    <>
      <FileBreadcrumbs
        key={currentFile.file.path}
        file={currentFile.file}
        directory={directory}
      />
      {(() => {
        if (currentFile.hasError) {
          return <ErrorLayout />
        }

        if (currentFile.type === 'database') {
          return <DatabaseLayout {...currentFile} viewName={view} />
        }

        if (currentFile.type === 'folder') {
          return <FolderLayout {...currentFile} />
        }

        return <TextLayout {...currentFile} />
      })()}
    </>
  )
}
