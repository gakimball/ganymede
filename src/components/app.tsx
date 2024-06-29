import { useCallback, useEffect, useRef } from 'preact/hooks'
import { DropHandler } from './drop-handler'
import { FileBrowser } from './file-browser'
import { AppStore } from '../state/app-store'
import { TextViewer } from './text-viewer'
import { StoreContext } from '../state/store-context'
import { DatabaseViewer } from './database-viewer'
import img from '../assets/placeholder.png'
import { QuickFind } from './quick-find'

const initialState = new AppStore()

export const App = () => {
  const { current: store } = useRef(initialState)
  const handleFile = useCallback(async (file: File) => {}, [])
  const viewType = store.currentViewType.value
  const viewError = store.currentViewHasError.value

  useEffect(() => {
    store.initialize()
  }, [store])

  return (
    <StoreContext.Provider value={store}>
      <FileBrowser />
      <div
        className="ps-3 overflow-x-scroll"
        style={{
          marginLeft: 'var(--App-sidebar-width)',
        }}
      >
        <DropHandler onDroppedFile={handleFile}>
          {viewError && (
            <div
              className="h-100 d-flex align-items-center justify-content-center"
              style={{
                paddingTop: '50px'
              }}
            >
              <p>
                Error loading this file. It might be a binary format.
              </p>
            </div>
          )}
          {!viewError && (
            <>
              {!viewType && (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: '100vh' }}
                >
                  <img src={img} />
                </div>
              )}
              {viewType === 'database' && (
                <DatabaseViewer />
              )}
              {viewType === 'text' && (
                <TextViewer />
              )}
            </>
          )}
        </DropHandler>
      </div>
      <QuickFind />
    </StoreContext.Provider>
  )
}
