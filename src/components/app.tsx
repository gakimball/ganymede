import { useCallback, useEffect, useRef } from 'preact/hooks'
import { Table } from './table'
import { DropHandler } from './drop-handler'
import { Container } from './container'
import { Board } from './board'
import { FileBrowser } from './file-browser'
import { createState } from '../state/state'
import { RecordViewer } from './record-viewer'
import { ViewSelect } from './view-select'

// const testRec = `
// %rec: State
// `

// const defaultViewConfig = `
// %rec: View
// %allowed: Name Layout Sort Filter Group Fields
// %mandatory: Name Layout
// %type Layout enum Table Board

// Name: Board
// Layout: Board
// Group: Category
// `.trim()

const views = {
  Table,
  Board,
}

const initialState = createState()

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
  const CurrentViewComponent = currentView?.view?.Layout
    ? views[currentView?.view.Layout]
    : undefined

  return (
    <Container>
      <div class="d-flex flex-row">
        <div style={{ width: '300px', paddingRight: '16px' }}>
          <FileBrowser
            files={state.files.value}
            views={state.viewsList.value}
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
            {currentView && (
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
              </>
            )}
            {currentView?.view && state.currentRecord.value && (
              <RecordViewer
                fields={currentView.database.fields}
                record={state.currentRecord.value}
                viewConfig={currentView.view}
                onSave={state.updateRecord}
                onClose={state.closeRecord}
              />
            )}
          </DropHandler>
        </div>
      </div>
    </Container>
  )
}
