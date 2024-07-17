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
import { CREATE_NEW_RECORD } from '../../state/app-store';
import { DatabaseFile } from '../../state/file-store';
import { ViewEditor } from '../common/view-editor';
import { Callout } from '../common/callout';
import { AggregateView } from '../views/aggregate-view';

const viewComponents = {
  Table: TableView,
  Board: BoardView,
  Text: TextView,
  List: ListView,
  Aggregate: AggregateView,
}

export const DatabaseLayout = memo<DatabaseFile>(({
  file,
}) => {
  const { view: viewName } = useRoute().query

  const { files, views } = useStore()
  const directory = files.directory.value
  const viewsList = views.list.value
  const currentView = views.current.value
  const editing = views.editing.value
  const loadingViews = views.loadingViews.value
  const editingView = views.editingView.value
  const creatingView = views.creatingView.value

  const fileViews = useMemo(() => {
    return viewsList.filter(view => view.File === file.name)
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

  const View = currentView && viewComponents[currentView.config.Layout]
  const recordViewerIsFullScreen = parseFieldValue(currentView?.config.Full_Page, {
    name: 'Full_Page',
    type: DatabaseFieldType.BOOL,
  })
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
          fields={currentView.database.fields}
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
