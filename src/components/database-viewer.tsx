import { memo } from 'preact/compat';
import { useStore } from '../state/use-store';
import { ViewSelect } from './view-select';
import { Table } from './table';
import { Board } from './board';
import { DatabaseTextViewer } from './database-text-viewer';
import { RecordViewer } from './record-viewer';

const views = {
  Table,
  Board,
  Text: DatabaseTextViewer,
}

export const DatabaseViewer = memo(() => {
  const store = useStore()
  const view = store.currentView.value

  if (view?.type !== 'database') {
    return null
  }

  const CurrentViewComponent = view.view?.Layout
    ? views[view.view.Layout]
    : undefined

  return (
    <>
      <ViewSelect
        file={view.file}
        views={store.viewsForCurrentFile.value}
        current={view.view}
        onChange={store.openView}
      />
      {CurrentViewComponent && (
        <CurrentViewComponent
          {...view.database}
          config={view.view!}
          onSelectRecord={store.openRecord}
          directory={store.directory}
        />
      )}
      {view.view && store.currentRecord.value && (
        <RecordViewer
          fields={view.database.fields}
          record={store.currentRecord.value}
          viewConfig={view.view}
          onSave={store.updateRecord}
          onClose={store.closeRecord}
        />
      )}
    </>
  )
})
