import { open as openDialog } from '@tauri-apps/api/dialog'
import { FileEntry, readDir, readTextFile } from '@tauri-apps/api/fs'

import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { Database } from '../types/database'
import { Table } from './table'
import { parseRecfile } from '../utils/parse-recfile'
import { DropHandler } from './drop-handler'
import { Container } from './container'
import { ViewSelect } from './view-select'
import { Board } from './board'
import { ViewConfig } from '../types/view-config'
import { FileBrowser } from './file-browser'

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
  const [files, setFiles] = useState<FileEntry[]>([])

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dirRef = useRef<string>('')

  const handleFile = useCallback(async (file: File) => {
    // setFileName(file.name)
    // setDatabase(parseRecfile(await file.text()))
  }, [])

  // const updateViewConfig = useCallback(() => {
  //   const db = parseRecfile(textareaRef.current!.value)
  //   setViewsDb(db)
  //   setSelectedView(db.records[0].Name!)
  // }, [])

  const handleSetDirectory = useCallback(async () => {
    const selected = await openDialog({
      directory: true,
    })
    if (typeof selected === 'string') {
      dirRef.current = selected
      const files = await readDir(selected)
      setFiles(files)
      const configFile = files.find(file => file.name === '_recdb.rec')
      if (configFile) {
        const configFileContents = await readTextFile(configFile.path)
        setViewsDb(parseRecfile(configFileContents))
      }
    }
  }, [])

  const handleSelectView = useCallback(async (file: FileEntry, view: ViewConfig) => {
    const fileContents = await readTextFile(file.path)
    setDatabase(parseRecfile(fileContents))
    setSelectedView(view.Name)
  }, [])

  const allViews = (viewsDb.records as unknown as ViewConfig[])
  const currentView = allViews.find(record => record.Name === selectedView)
  const CurrentViewComponent = currentView?.Layout
    ? views[currentView.Layout]
    : undefined

  return (
    <Container>
      <div class="d-flex flex-row">
        <div style={{ width: '300px', paddingRight: '16px' }}>
          <FileBrowser
            files={files}
            views={allViews}
            onSetDirectory={handleSetDirectory}
            onSelectView={handleSelectView}
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
            {fileName}
          </p>
          <DropHandler onDroppedFile={handleFile}>
            {/* <ViewSelect
              views={viewsDb.records.map(record => record.Name!)}
              current={selectedView}
              onChange={setSelectedView}
            /> */}
            {CurrentViewComponent && currentView && (
              <CurrentViewComponent {...database} config={currentView} />
            )}
          </DropHandler>
        </div>
      </div>
    </Container>
  )
}
