import { useCallback, useEffect, useRef } from 'preact/hooks'
import { Table } from './table'
import { DropHandler } from './drop-handler'
import { Container } from './container'
import { Board } from './board'
import { FileBrowser } from './file-browser'
import { State } from '../state/state'
import { RecordViewer } from './record-viewer'
import { ViewSelect } from './view-select'
import { TextViewer } from './text-viewer'
import { DatabaseTextViewer } from './database-text-viewer'
import { StateContext } from '../state/state-context'

const views = {
  Table,
  Board,
  Text: DatabaseTextViewer,
}

const initialState = new State()

export const App = () => {
  const { current: state } = useRef(initialState)
  const handleFile = useCallback(async (file: File) => {}, [])

  const currentView = state.currentView.value
  const CurrentViewComponent = (currentView?.type === 'database' && currentView.view?.Layout)
    ? views[currentView?.view.Layout]
    : undefined

  useEffect(() => {
    state.initialize()
  }, [state])

  return (
    <StateContext.Provider value={state}>
      <Container>
        <div class="d-flex flex-row">
          <div style={{ width: '300px', paddingRight: '16px' }}>
            <FileBrowser />
            {/* <textarea
              ref={textareaRef}
              className="form-control"
              defaultValue={defaultViewConfig}
              rows={10}
            ></textarea>
            <br />
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateViewConfig}
            >
              Update
            </button> */}
          </div>
          <div style={{ flex: '1', overflow: 'hidden' }}>
            <DropHandler onDroppedFile={handleFile}>
              {currentView?.type === 'database' && (
                <>
                  <ViewSelect
                    file={currentView.file}
                    views={state.viewsForCurrentFile.value}
                    current={currentView.view}
                    onChange={state.openView}
                  />
                  {CurrentViewComponent && (
                    <CurrentViewComponent
                      {...currentView.database}
                      config={currentView.view!}
                      onSelectRecord={state.openRecord}
                      directory={state.directory}
                    />
                  )}
                  {currentView.view && state.currentRecord.value && (
                    <RecordViewer
                      fields={currentView.database.fields}
                      record={state.currentRecord.value}
                      viewConfig={currentView.view}
                      onSave={state.updateRecord}
                      onClose={state.closeRecord}
                    />
                  )}
                </>
              )}
              {currentView?.type === 'text' && (
                <TextViewer
                  key={currentView.file.path}
                  file={currentView.file}
                  contents={currentView.contents}
                />
              )}
            </DropHandler>
          </div>
        </div>
      </Container>
    </StateContext.Provider >
  )
}
