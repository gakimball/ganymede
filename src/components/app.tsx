import { useCallback, useEffect, useRef } from 'preact/hooks'
import { DropHandler } from './drop-handler'
import { Container } from './container'
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
      <Container>
        <div class="d-flex flex-row">
          <div style={{ width: '300px', paddingRight: '16px' }}>
            <FileBrowser />
          </div>
          <div style={{ flex: '1', overflow: 'hidden' }}>
            <DropHandler onDroppedFile={handleFile}>
              {viewType === 'database' && (
                <DatabaseViewer />
              )}
              {viewType === 'text' && (
                <TextViewer />
              )}
            </DropHandler>
          </div>
        </div>
      </Container>
    </StoreContext.Provider>
  )
}
