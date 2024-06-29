import { useCallback, useEffect, useRef } from 'preact/hooks'
import { DropHandler } from './drop-handler'
import { FileBrowser } from './file-browser'
import { AppStore } from '../state/app-store'
import { TextViewer } from './text-viewer'
import { StoreContext } from '../state/store-context'
import { DatabaseViewer } from './database-viewer'
import img from '../assets/placeholder.png'

const initialState = new AppStore()

export const App = () => {
  const { current: store } = useRef(initialState)
  const handleFile = useCallback(async (file: File) => {}, [])
  const viewType = store.currentViewType.value

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
        </DropHandler>
      </div>
    </StoreContext.Provider>
  )
}
