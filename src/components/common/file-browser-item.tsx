import { FileEntry } from '@tauri-apps/api/fs';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks'
import { getFileIcon } from '../../utils/get-file-icon';
import { Icon } from './icon';
import getExt from 'get-ext';
import { showMenu } from 'tauri-plugin-context-menu';
import { FeatherIconNames } from 'feather-icons';
import { compact } from '../../utils/compact';
import { parseFileName } from '../../utils/parse-file-name';

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
  isLast?: boolean;
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
  isLast = false,
  indent = 0,
  onAction,
  fileIconMap,
}) => {
  const isDir = !!file.children
  const { name, jdNumber, ext } = parseFileName(file)

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
    'ps-2',
    'ps-4',
    'ps-6',
    'ps-8',
  ]

  return (
    <div className="relative">
      <div
        data-active={isActive}
        data-disabled={isDisabled}
        data-last={isLast}
        className={`
          flex items-center
          w-full
          py-1 ${indentClasses[indent] ?? 'ps-2'}
          mb-1
          rounded-md
          select-none
          hover:bg-background-highlight
          truncate
          cursor-pointer
          data-[active=true]:bg-background-highlight
          data-[disabled=true]:pointer-events-none
        `}
        onClick={() => onAction(file, 'open')}
        onContextMenu={handleContextMenu}
      >
        <div className="h-icon me-3">
          <Icon name={getFileIcon(file, fileIconMap)} />
        </div>

        <span className="text-content-secondary pe-1 empty:pe-0">
          {jdNumber}
        </span>

        {isDisabled && '[Broken] '}{name}

        <span className="text-content-secondary">
          {ext}
        </span>
      </div>

      {isExpandable && (
        <button
          type="button"
          className={`
            absolute top-0 right-1
            h-full w-8
            hover:bg-background-highlight
            cursor-pointer
            rounded-full
          `}
          onClick={() => onAction(file, 'toggle')}
        >
          <div className="relative top-1">
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-left'} />
          </div>
        </button>
      )}
    </div>
  )
})
