import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { Database } from '../types/database'
import { Table } from './table'
import { parseRecfile } from '../utils/parse-recfile'
import { DropHandler } from './drop-handler'
import { Container } from './container'
import { ViewSelect } from './view-select'
import { Board } from './board'
import { ViewConfig } from '../types/view-config'

const testRec = `
%rec: State
`

const defaultViewConfig = `
%rec: View
%allowed: Name Layout Sort Filter Group Fields
%mandatory: Name Layout
%type Layout enum Table Board

Name: Board
Layout: Board
Group: Category
`.trim()

const views = {
  Table,
  Board,
}

export const App = () => {
  const [fileName, setFileName] = useState('(no file)')
  const [database, setDatabase] = useState(() => parseRecfile(testRec))
  const [viewsDb, setViewsDb] = useState(() => parseRecfile(defaultViewConfig))
  const [selectedView, setSelectedView] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setDatabase(parseRecfile(await file.text()))
  }, [])

  const updateViewConfig = useCallback(() => {
    const db = parseRecfile(textareaRef.current!.value)
    setViewsDb(db)
    setSelectedView(db.records[0].Name ?? null)
  }, [])

  const currentView = (viewsDb.records as unknown as ViewConfig[]).find(record => record.Name === selectedView)
  const CurrentViewComponent = currentView?.Layout
    ? views[currentView.Layout]
    : undefined

  return (
    <Container>
      <div class="d-flex flex-row">
        <div style={{ width: '300px', paddingRight: '16px' }}>
          <textarea
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
          </button>
        </div>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <p className="lead">
            {fileName}
          </p>
          <DropHandler onDroppedFile={handleFile}>
            <ViewSelect
              views={viewsDb.records.map(record => record.Name!)}
              current={selectedView}
              onChange={setSelectedView}
            />
            {CurrentViewComponent && currentView && (
              <CurrentViewComponent {...database} config={currentView} />
            )}
          </DropHandler>
        </div>
      </div>
    </Container>
  )
}
