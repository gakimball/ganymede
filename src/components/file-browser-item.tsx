import { FileEntry } from '@tauri-apps/api/fs';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks'
import s from './file-browser-item.module.css'
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

  return (
    <button
      className={`
        list-group-item
        list-group-item-action
        ${isActive ? 'list-group-item-light' : ''}
        ${isDisabled ? 'disabled' : ''}
        ps-${indent + 3}
        d-flex align-items-center
        text-truncate
      `}
      style={{
        userSelect: 'none',
      }}
      type="button"
      disabled={isDisabled}
      onClick={() => onAction(file, 'open')}
      onContextMenu={handleContextMenu}
    >
      <div className={s.icon}>
        <Icon size={16} name={getFileIcon(file)} />
      </div>
      {isDisabled && '[Broken] '}
      {displayName}
      <span className="text-body-secondary">
        {ext}
      </span>
    </button>
  )
})
