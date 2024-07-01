import { useEffect, useRef } from 'preact/hooks'
import { FileBrowser } from './file-browser'
import { AppStore } from '../state/app-store'
import { TextViewer } from './text-viewer'
import { StoreContext } from '../state/store-context'
import { DatabaseViewer } from './database-viewer'
import { QuickFind } from './quick-find'
import { ThemeManager } from './theme-manager'
import { ViewError } from './view-error'
import { EmptyView } from './empty-view'

const initialState = new AppStore()

export const App = () => {
  const { current: store } = useRef(initialState)
  const viewType = store.currentViewType.value
  const viewError = store.currentViewHasError.value

  useEffect(() => {
    store.initialize()
  }, [store])

  return (
    <StoreContext.Provider value={store}>
      <ThemeManager />
      <FileBrowser />
      <div className="ps-3 ms-sidebar">
        {viewError && (
          <ViewError />
        )}
        {!viewError && (
          <>
            {!viewType && (
              <EmptyView />
            )}
            {viewType === 'database' && (
              <DatabaseViewer />
            )}
            {viewType === 'text' && (
              <TextViewer />
            )}
          </>
        )}
      </div>
      <QuickFind />
    </StoreContext.Provider>
  )
}
