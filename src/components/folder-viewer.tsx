import { memo } from 'preact/compat';
import { useStore } from '../state/use-store';
import { FileBrowserAction, FileBrowserItem } from './file-browser-item';
import { useEventHandler } from '../hooks/use-event-handler';
import { FileEntry } from '@tauri-apps/api/fs';

export const FolderViewer = memo(() => {
  const store = useStore()
  const view = store.currentView.value

  const handleAction = useEventHandler((file: FileEntry, action: FileBrowserAction) => {
    if (action === 'open') {
      store.openFile(file)
    }
  })

  if (view?.type !== 'folder') {
    return null
  }

  return (
    <div className="pt-6">
      <p className="ps-3 pb-3 border-b-1 border-border">
        {view.file.name}&nbsp;/
      </p>
      {view.file.children?.map(file => (
        <FileBrowserItem
          key={file.path}
          file={file}
          onAction={handleAction}
        />
      ))}
    </div>
  )
})
