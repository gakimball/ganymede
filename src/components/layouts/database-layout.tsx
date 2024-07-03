import { memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks'
import { useRoute } from 'preact-iso';
import { useStore } from '../../state/use-store';
import { ViewSelect } from '../common/view-select';
import { TableView } from '../views/table-view';
import { BoardView } from '../views/board-view';
import { TextView } from '../views/text-view';
import { RecordViewer } from '../common/record-viewer';
import { ListView } from '../views/list-view';
import { parseFieldValue } from '../../utils/parse-field-value';
import { DatabaseFieldType } from '../../types/database';
import { DATABASE_CHANGE_EVENT } from '../../utils/constants';
import { CREATE_NEW_RECORD } from '../../state/app-store';
import { DatabaseFile } from '../../state/file-store';

const viewComponents = {
  Table: TableView,
  Board: BoardView,
  Text: TextView,
  List: ListView,
}

export const DatabaseLayout = memo<DatabaseFile>(({
  file,
  database,
}) => {
  const { view: viewName } = useRoute().query

  const { files, views } = useStore()
  const directory = files.directory.value
  const viewsList = views.list.value
  const currentView = views.current.value
  const editing = views.editing.value
  const loadingViews = views.loadingViews.value

  const [lastUpdate, setLastUpdate] = useState(0)

  const fileViews = useMemo(() => {
    return viewsList.filter(view => view.File === file.name)
  }, [file, viewsList])

  // Force re-render when a database change is made
  useEffect(() => {
    const handle = () => setLastUpdate(Date.now())
    window.addEventListener(DATABASE_CHANGE_EVENT, handle)
    return () => window.removeEventListener(DATABASE_CHANGE_EVENT, handle)
  }, [])

  // Load a view based on the route
  useEffect(() => {
    if (file && !loadingViews) {
      if (viewName) {
        views.openViewByName(file, viewName)
      } else {
        views.openDefaultViewForFile(file)
      }
    }
  }, [file, viewName, loadingViews])

  const View = currentView && viewComponents[currentView.Layout]
  const recordViewerIsFullScreen = parseFieldValue(currentView?.Full_Page, {
    name: 'Full_Page',
    type: DatabaseFieldType.BOOL,
  })
  const hideRecordBrowser = editing !== null && recordViewerIsFullScreen

  return (
    <div className="pt-3 ps-4">
      <ViewSelect
        file={file}
        views={fileViews}
        current={currentView}
        onChange={views.openView}
        onCreateNew={views.openCreateRecord}
      />
      {View && !hideRecordBrowser && (
        <View
          key={lastUpdate}
          {...database}
          config={currentView}
          file={file}
          onSelectRecord={views.openEditRecord}
          directory={directory}
        />
      )}
      {editing && (
        <RecordViewer
          fields={database.fields}
          record={editing === CREATE_NEW_RECORD ? undefined : editing}
          viewConfig={currentView}
          onCreate={views.createRecord}
          onUpdate={views.updateRecord}
          onDelete={views.deleteRecord}
          onClose={views.closeEditor}
        />
      )}
    </div>
  )
})
