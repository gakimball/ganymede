import { memo } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { FileBrowserAction, FileBrowserItem } from '../common/file-browser-item';
import { useEventHandler } from '../../hooks/use-event-handler';
import { FileEntry } from '@tauri-apps/api/fs';
import { Folder } from '../../state/file-store';

export const FolderLayout = memo<Folder>(({
  file,
}) => {
  const { files } = useStore()
  const fileIcons = files.fileIcons.value

  const handleAction = useEventHandler((file: FileEntry, action: FileBrowserAction) => {
    if (action === 'open') {
      files.openFile(file)
    }
  })

  return (
    <div>
      {file.children?.map(file => (
        <FileBrowserItem
          key={file.path}
          file={file}
          onAction={handleAction}
          fileIconMap={fileIcons}
        />
      ))}
    </div>
  )
})
