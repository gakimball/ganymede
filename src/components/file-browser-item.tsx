import { FileEntry } from '@tauri-apps/api/fs';
import { memo } from 'preact/compat';
import s from './file-browser-item.module.css'
import { getFileIcon } from '../utils/get-file-icon';
import { Icon } from './icon';
import getExt from 'get-ext';

interface FileBrowserItemProps {
  file: FileEntry;
  isActive?: boolean;
  isDisabled?: boolean;
  indent?: number;
  onClick: (file: FileEntry) => void;
}

export const FileBrowserItem = memo<FileBrowserItemProps>(({
  file,
  isActive = false,
  isDisabled = false,
  indent = 0,
  onClick,
}) => {
  const name = file?.name ?? file.path
  const isDir = !!file.children
  const ext = isDir ? '' : getExt(name)
  const displayName = isDir ? file.name : file.name?.slice(0, -ext.length)

  return (
    <button
      className={`
        list-group-item
        list-group-item-action
        ${isActive ? 'list-group-item-light' : ''}
        ${isDisabled ? 'disabled' : ''}
        ps-${indent + 3}
        d-flex
        align-items-center
      `}
      type="button"
      disabled={isDisabled}
      onClick={() => onClick(file)}
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
