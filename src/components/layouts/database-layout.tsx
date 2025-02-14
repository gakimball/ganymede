import { memo } from 'preact/compat';
import { useEffect, useMemo } from 'preact/hooks'
import { useStore } from '../../state/use-store';
import { ViewSelect } from '../common/view-select';
import { TableView } from '../views/table-view';
import { BoardView } from '../views/board-view';
import { TextView } from '../views/text-view';
import { RecordViewer } from '../common/record-viewer';
import { ListView } from '../views/list-view';
import { CREATE_NEW_RECORD } from '../../state/app-store';
import { DatabaseFile } from '../../state/file-store';
import { ViewEditor } from '../common/view-editor';
import { Callout } from '../common/callout';
import { RecordView } from '../views/record-view';

const viewComponents = {
  Table: TableView,
  Board: BoardView,
  Text: TextView,
  List: ListView,
  Record: RecordView,
}

interface DatabaseLayoutProps extends DatabaseFile {
  viewName: string | null;
}

export const DatabaseLayout = memo<DatabaseLayoutProps>(({
  file,
  viewName,
}) => {
  const { files, views } = useStore()
  const directory = files.directory.value
  const viewsList = views.list.value
  const currentView = views.current.value
  const editing = views.editing.value
  const loadingViews = views.loadingViews.value
  const editingView = views.editingView.value
  const creatingView = views.creatingView.value

  const fileViews = useMemo(() => {
    return viewsList.filter(view => view.file === file.name)
  }, [file, viewsList])

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

  const View = currentView && viewComponents[currentView.config.layout]
  const recordViewerIsFullScreen = currentView?.config.fullPage === true
  const hideRecordBrowser = editing !== null && recordViewerIsFullScreen

  return (
    <div className="pt-3 px-4">
      <ViewSelect
        file={file}
        views={fileViews}
        current={currentView?.config}
        onChange={views.openView}
        onCreateRecord={views.openCreateRecord}
        onCreateView={views.toggleViewCreator}
        onEditView={views.toggleViewEditor}
      />
      {currentView && currentView.database.errors.length > 0 && (
        <Callout type="error">
          {currentView?.database.errors[0]}
        </Callout>
      )}
      {View && !hideRecordBrowser && (
        <View
          {...currentView}
          file={file}
          onSelectRecord={views.openEditRecord}
          directory={directory}
        />
      )}
      {currentView && !View && (
        <Callout type="error">
          No layout is specified for this view.
        </Callout>
      )}
      {currentView && editingView && (
        <ViewEditor
          file={file}
          view={currentView.config}
          viewFields={views.fields.value}
          recordFields={currentView.database.fields}
          onChange={views.editCurrentView}
          onClose={views.toggleViewEditor}
          onDelete={views.deleteCurrentView}
        />
      )}
      {currentView && creatingView && (
        <ViewEditor
          file={file}
          viewFields={views.fields.value}
          recordFields={currentView.database.fields}
          onChange={views.createView}
          onClose={views.toggleViewCreator}
        />
      )}
      {currentView && editing && (
        <RecordViewer
          database={currentView.database}
          record={editing === CREATE_NEW_RECORD ? undefined : editing}
          viewConfig={currentView.config}
          onCreate={views.createRecord}
          onUpdate={views.updateRecord}
          onDelete={views.deleteRecord}
          onClose={views.closeEditor}
        />
      )}
    </div>
  )
})
