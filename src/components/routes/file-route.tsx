import { useRoute } from 'preact-iso'
import { useStore } from '../../state/use-store'
import { useEffect } from 'preact/hooks'
import { ViewError } from '../view-error'
import { EmptyLayout } from '../layouts/empty-layout'
import { DatabaseLayout } from '../layouts/database-layout'
import { TextLayout } from '../layouts/text-layout'
import { FolderLayout } from '../layouts/folder-layout'

export const FileRoute = () => {
  const { path } = useRoute().query

  const store = useStore()
  const viewType = store.currentViewType.value
  const viewError = store.currentViewHasError.value

  useEffect(() => {
    if (path) {
      store.openFileByPath(path)
    }
  }, [path])

  if (viewError) {
    return <ViewError />
  }

  if (!viewType) {
    return <EmptyLayout />
  }

  const Layout = {
    database: DatabaseLayout,
    text: TextLayout,
    folder: FolderLayout,
  }[viewType]

  return <Layout />
}
