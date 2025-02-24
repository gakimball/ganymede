import { FileEntry } from '@tauri-apps/api/fs';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks'
import { getFileIcon } from '../../utils/get-file-icon';
import { Icon } from './icon';
import getExt from 'get-ext';
import { showMenu } from 'tauri-plugin-context-menu';
import { FeatherIconNames } from 'feather-icons';
import { compact } from '../../utils/compact';

export type FileBrowserAction =
  | 'open'
  | 'favorite'
  | 'rename'
  | 'delete'
  | 'toggle'
  | 'new-file'
  | 'new-database'
  | 'new-folder'
  | 'icon'
  | 'copy-path'
  | 'move'
  | 'open-in-file-viewer'

interface FileBrowserItemProps {
  file: FileEntry;
  isActive?: boolean;
  isDisabled?: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
  indent?: number;
  onAction: (
    file: FileEntry,
    entry: FileBrowserAction
  ) => void;
  fileIconMap: Record<string, FeatherIconNames | undefined>;
}

export const FileBrowserItem = memo<FileBrowserItemProps>(({
  file,
  isActive = false,
  isDisabled = false,
  isExpandable = false,
  isExpanded = false,
  indent = 0,
  onAction,
  fileIconMap,
}) => {
  const name = file?.name ?? file.path
  const isDir = !!file.children
  const ext = isDir ? '' : getExt(name)
  const displayName = (isDir || ext.length === 0) ? file.name : file.name?.slice(0, -ext.length)

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault()
    const label = isDir ? 'folder' : 'file'

    showMenu({
      items: compact([
        isDir && {
          label: 'New file',
          event: () => onAction(file, 'new-file'),
        },
        isDir && {
          label: 'New database',
          event: () => onAction(file, 'new-database'),
        },
        isDir && {
          label: 'New folder',
          event: () => onAction(file, 'new-folder'),
        },
        isDir && {
          is_separator: true,
        },
        {
          label: 'Add to favorites',
          event: () => onAction(file, 'favorite'),
        },
        {
          label: 'Change icon',
          event: () => onAction(file, 'icon'),
        },
        {
          is_separator: true,
        },
        {
          label: 'Reveal in Finder',
          event: () => onAction(file, 'open-in-file-viewer'),
        },
        {
          label: `Copy ${label} path`,
          event: () => onAction(file, 'copy-path'),
        },
        {
          is_separator: true,
        },
        {
          label: `Rename ${label}`,
          event: () => onAction(file, 'rename'),
        },
        {
          label: `Move ${label}`,
          event: () => onAction(file, 'move'),
        },
        {
          label: `Delete ${label}`,
          event: () => onAction(file, 'delete'),
        }
      ])
    })
  }, [])

  const indentClasses = [
    'ps-3',
    'ps-6',
    'ps-9',
    'ps-12',
  ]

  return (
    <div className="relative">
      <div
        className={`
          flex items-center
          w-full
          py-2 ${indentClasses[indent] ?? 'ps-6'}
          border-b-1 border-border
          select-none
          hover:bg-background-highlight
          truncate
          cursor-pointer
          ${isActive ? 'bg-background-highlight' : ''}
          ${isDisabled ? 'pointer-events-none' : ''}
        `}
        onClick={() => onAction(file, 'open')}
        onContextMenu={handleContextMenu}
      >
        <div className="h-icon me-3">
          <Icon name={getFileIcon(file, fileIconMap)} />
        </div>

        {isDisabled && '[Broken] '}{displayName}

        <span className="text-content-secondary">
          {ext}
        </span>
      </div>

      {isExpandable && (
        <button
          type="button"
          className={`
            absolute top-0 right-0
            h-full w-10
            hover:bg-background-highlight
            cursor-pointer
          `}
          onClick={() => onAction(file, 'toggle')}
        >
          <div className="relative top-[3px]">
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-left'} />
          </div>
        </button>
      )}
    </div>
  )
})
