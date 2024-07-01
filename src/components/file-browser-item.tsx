import { FileEntry } from '@tauri-apps/api/fs';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks'
import { getFileIcon } from '../utils/get-file-icon';
import { Icon } from './icon';
import getExt from 'get-ext';
import { showMenu } from 'tauri-plugin-context-menu';

export type FileBrowserAction = 'open' | 'favorite' | 'rename' | 'delete'

interface FileBrowserItemProps {
  file: FileEntry;
  isActive?: boolean;
  isDisabled?: boolean;
  indent?: number;
  onAction: (
    file: FileEntry,
    entry: FileBrowserAction
  ) => void;
}

export const FileBrowserItem = memo<FileBrowserItemProps>(({
  file,
  isActive = false,
  isDisabled = false,
  indent = 0,
  onAction,
}) => {
  const name = file?.name ?? file.path
  const isDir = !!file.children
  const ext = isDir ? '' : getExt(name)
  const displayName = isDir ? file.name : file.name?.slice(0, -ext.length)

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault()

    showMenu({
      items: [
        {
          label: 'Add to favorites',
          event: () => onAction(file, 'favorite'),
        },
        {
          label: 'Rename file',
          event: () => onAction(file, 'rename'),
        },
        {
          label: 'Delete file',
          event: () => onAction(file, 'delete'),
        }
      ]
    })
  }, [])

  const indentClasses = [
    'ps-3',
    'ps-6',
    'ps-9',
    'ps-12',
  ]

  return (
    <button
      className={`
        flex items-center
        w-full
        py-2 ${indentClasses[indent] ?? 'ps-6'}
        border-b-1 border-border
        select-none
        hover:bg-background-highlight
        truncate
        ${isActive ? 'bg-background-highlight' : ''}
      `}
      type="button"
      disabled={isDisabled}
      onClick={() => onAction(file, 'open')}
      onContextMenu={handleContextMenu}
    >
      <div className="h-icon me-3">
        <Icon name={getFileIcon(file)} />
      </div>
      {isDisabled && '[Broken] '}
      {displayName}
      <span className="text-content-secondary">
        {ext}
      </span>
    </button>
  )
})
