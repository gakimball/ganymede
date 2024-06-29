import { memo } from 'preact/compat';
import { useStore } from '../state/use-store';
import { ViewSelect } from './view-select';
import { Table } from './table';
import { Board } from './board';
import { DatabaseTextViewer } from './database-text-viewer';
import { RecordViewer } from './record-viewer';
import { ListView } from './list-view';
import { parseFieldValue } from '../utils/parse-field-value';
import { RecordFieldType } from '../types/database';

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

  if (view?.type !== 'database') {
    return null
  }

  const CurrentViewComponent = view.view?.Layout
    ? views[view.view.Layout]
    : undefined
  const recordViewerIsFullScreen = parseFieldValue(view.view?.Full_Page, { type: RecordFieldType.BOOL })
  const hideRecordBrowser = currentRecord !== null && recordViewerIsFullScreen

  return (
    <div style={{ paddingTop: '10px' }}>
      <ViewSelect
        file={view.file}
        views={store.viewsForCurrentFile.value}
        current={view.view}
        onChange={store.openView}
      />
      {CurrentViewComponent && !hideRecordBrowser && (
        <CurrentViewComponent
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
          record={currentRecord}
          viewConfig={view.view}
          onSave={store.updateRecord}
          onClose={store.closeRecord}
        />
      )}
    </div>
  )
})
