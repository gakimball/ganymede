import { memo } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { FileBrowserAction, FileBrowserItem } from '../common/file-browser-item';
import { useEventHandler } from '../../hooks/use-event-handler';
import { FileEntry } from '@tauri-apps/api/fs';
import { Folder } from '../../state/file-store';
import { useFileActions } from '../../hooks/use-file-actions';

export const FolderLayout = memo<Folder>(({
  file,
}) => {
  const { files } = useStore()
  const fileIcons = files.fileIcons.value
  const handleFileAction = useFileActions()

  return (
    <div className="border-1 border-border rounded-md m-4">
      {file.children?.slice().sort((a, b) => a.name!.localeCompare(b.name!)).map((file, index, array) => (
        <FileBrowserItem
          key={file.path}
          file={file}
          onAction={handleFileAction}
          fileIconMap={fileIcons}
          isLast={index === array.length - 1}
        />
      ))}
    </div>
  )
})
