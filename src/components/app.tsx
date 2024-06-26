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

const views = {
  Table,
  Board,
}

const initialState = new State()

export const App = () => {
  const { current: state } = useRef(initialState)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFile = useCallback(async (file: File) => {
    // setFileName(file.name)
    // setDatabase(parseRecfile(await file.text()))
  }, [])

  // const updateViewConfig = useCallback(() => {
  //   const db = parseRecfile(textareaRef.current!.value)
  //   setViewsDb(db)
  //   setSelectedView(db.records[0].Name!)
  // }, [])

  useEffect(() => {
    state.initialize()
  }, [state])

  const currentView = state.currentView.value
  const CurrentViewComponent = (currentView?.type === 'database' && currentView.view?.Layout)
    ? views[currentView?.view.Layout]
    : undefined

  return (
    <Container>
      <div class="d-flex flex-row">
        <div style={{ width: '300px', paddingRight: '16px' }}>
          <FileBrowser
            files={state.files.value}
            views={state.viewsList.value}
            selectedFile={state.currentView.value?.file}
            onSetDirectory={state.openDirectoryPicker}
            onSelectFile={state.openFile}
          />
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
          <p className="lead">
            {state.currentView.value?.file}
          </p>
          <DropHandler onDroppedFile={handleFile}>
            {currentView?.type === 'database' && (
              <>
                <ViewSelect
                  views={state.viewsForCurrentFile.value}
                  current={currentView.view}
                  onChange={state.openView}
                />
                {CurrentViewComponent && (
                  <CurrentViewComponent
                    {...currentView.database}
                    config={currentView.view!}
                    onSelectRecord={state.openRecord}
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
              <TextViewer contents={currentView.contents} />
            )}
          </DropHandler>
        </div>
      </div>
    </Container>
  )
}
