import { memo } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useStore } from '../state/use-store';
import { ViewSelect } from './view-select';
import { Table } from './table';
import { Board } from './board';
import { DatabaseTextViewer } from './database-text-viewer';
import { RecordViewer } from './record-viewer';
import { ListView } from './list-view';
import { parseFieldValue } from '../utils/parse-field-value';
import { DatabaseRecord, DatabaseFieldType } from '../types/database';
import { DATABASE_CHANGE_EVENT } from '../utils/constants';
import { CREATE_NEW_RECORD } from '../state/app-store';

const views = {
  Table,
  Board,
  Text: DatabaseTextViewer,
  List: ListView,
}

export const DatabaseViewer = memo(() => {
  const store = useStore()
  const view = store.currentView.value
  const currentRecord = store.currentRecord.value
  const directory = store.directory.value
  const [lastUpdate, setLastUpdate] = useState(0)

  const handleSave = useCallback((record: DatabaseRecord | undefined, update: DatabaseRecord) => {
    if (record) {
      store.updateRecord(record, update)
    } else {
      store.createRecord(update)
    }
  }, [store])

  useEffect(() => {
    const handle = () => setLastUpdate(Date.now())
    window.addEventListener(DATABASE_CHANGE_EVENT, handle)
    return () => window.removeEventListener(DATABASE_CHANGE_EVENT, handle)
  }, [])

  if (view?.type !== 'database') {
    return null
  }

  const CurrentViewComponent = view.view?.Layout
    ? views[view.view.Layout]
    : undefined
  const recordViewerIsFullScreen = parseFieldValue(view.view?.Full_Page, {
    name: 'Full_Page',
    type: DatabaseFieldType.BOOL,
  })
  const hideRecordBrowser = currentRecord !== null && recordViewerIsFullScreen

  return (
    <div className="pt-3 ps-3">
      <ViewSelect
        file={view.file}
        views={store.viewsForCurrentFile.value}
        current={view.view}
        onChange={store.openView}
        onCreateNew={store.openNewRecord}
      />
      {CurrentViewComponent && !hideRecordBrowser && (
        <CurrentViewComponent
          key={lastUpdate}
          {...view.database}
          config={view.view!}
          file={view.file}
          onSelectRecord={store.openRecord}
          directory={directory}
        />
      )}
      {view.view && currentRecord && (
        <RecordViewer
          fields={view.database.fields}
          record={currentRecord === CREATE_NEW_RECORD ? undefined : currentRecord}
          viewConfig={view.view}
          onSave={handleSave}
          onClose={store.closeRecord}
          onDelete={store.deleteRecord}
        />
      )}
    </div>
  )
})
