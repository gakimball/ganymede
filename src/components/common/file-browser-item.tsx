import { FileEntry } from '@tauri-apps/api/fs';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks'
import { getFileIcon } from '../../utils/get-file-icon';
import { Icon } from './icon';
import getExt from 'get-ext';
import { showMenu } from 'tauri-plugin-context-menu';
import queryString from 'query-string';
import { ROUTES } from '../../utils/routes';
import { FeatherIconNames } from 'feather-icons';

export type FileBrowserAction = 'open' | 'favorite' | 'rename' | 'delete' | 'toggle' | 'new'

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
  const displayName = isDir ? file.name : file.name?.slice(0, -ext.length)

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault()

    showMenu({
      items: [
        {
          label: 'New file here',
          event: () => onAction(file, 'new'),
        },
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
    <div className="relative">
      <a
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
        href={ROUTES.file(file.path)}
        disabled={isDisabled}
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
      </a>

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
          <div className="relative top-0.5">
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-left'} />
          </div>
        </button>
      )}
    </div>
  )
})
