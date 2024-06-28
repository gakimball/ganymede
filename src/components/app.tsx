import { useCallback, useEffect, useRef } from 'preact/hooks'
import { DropHandler } from './drop-handler'
import { Container } from './container'
import { FileBrowser } from './file-browser'
import { State } from '../state/state'
import { TextViewer } from './text-viewer'
import { StateContext } from '../state/state-context'
import { DatabaseViewer } from './database-viewer'

const initialState = new State()

export const App = () => {
  const { current: state } = useRef(initialState)
  const handleFile = useCallback(async (file: File) => {}, [])
  const viewType = state.currentViewType.value

  useEffect(() => {
    state.initialize()
  }, [state])

  return (
    <StateContext.Provider value={state}>
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
    </StateContext.Provider >
  )
}
