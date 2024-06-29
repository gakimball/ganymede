import { useCallback, useEffect, useRef } from 'preact/hooks'
import { DropHandler } from './drop-handler'
import { FileBrowser } from './file-browser'
import { AppStore } from '../state/app-store'
import { TextViewer } from './text-viewer'
import { StoreContext } from '../state/store-context'
import { DatabaseViewer } from './database-viewer'

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
      <div className="ps-3" style={{ marginLeft: '300px' }}>
        <DropHandler onDroppedFile={handleFile}>
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
