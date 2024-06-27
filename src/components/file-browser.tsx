import { Fragment, FunctionComponent } from 'preact';
import { ViewConfig } from '../types/view-config';
import type { FileEntry } from '@tauri-apps/api/fs';
import { FavoritesEntry } from '../types/favorites-entry';
import getExt from 'get-ext'
import { useCallback, useEffect, useState } from 'preact/hooks';
import { swapArrayValue } from '../utils/swap-array-value';
import { FileBrowserIcon } from './file-browser-icon';
import { FeatherIconNames } from 'feather-icons';
import { Icon } from './icon';
import s from './file-browser.module.css'

interface FileBrowserProps {
  files: FileEntry[];
  views: ViewConfig[];
  selectedFile?: FileEntry;
  favorites: FavoritesEntry[];
  onSetDirectory: () => void,
  onSelectFile: (file: FileEntry) => void;
}

export const FileBrowser: FunctionComponent<FileBrowserProps> = ({
  files,
  selectedFile,
  favorites,
  onSetDirectory,
  onSelectFile,
}) => {
  const recFiles = files
    .sort((a, b) => a.name!.localeCompare(b.name!))
  const [expandedDirs, setExpandedDirs] = useState<string[]>([])

  useEffect(() => {
    setExpandedDirs([])
  }, [files])

  const getIcon = useCallback((file: FileEntry): FeatherIconNames => {
    if (file.children) {
      return 'folder'
    }
    if (file.path.endsWith('.rec')) {
      return 'database'
    }
    if (file.path.endsWith('.xit')) {
      return 'check-square'
    }
    return 'file'
  }, [])

  const renderFile = (file: FileEntry, disabled = false, indent = 0) => {
    const active = file === selectedFile
    const name = file?.name ?? file.path
    const isDir = !!file.children
    const ext = isDir ? '' : getExt(name)

    return (
      <Fragment key={file.path}>
        <button
          className={`
            list-group-item
            list-group-item-action
            ${active ? 'active' : ''}
            ${disabled ? 'disabled' : ''}
            ps-${indent + 3}
            d-flex
            align-items-center
          `}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (isDir) {
              setExpandedDirs(prev => swapArrayValue(prev, file.path))
            } else {
              onSelectFile(file)
            }
          }}
        >
          <div className={s.icon}>
            <Icon size={16} name={getIcon(file)} />
          </div>
          {disabled ? '[Broken] ' : ''}
          {isDir ? file.name : file.name?.slice(0, -ext.length)}
          <span className="text-body-secondary">
            {ext}
          </span>
        </button>
        {isDir && expandedDirs.includes(file.path) && file.children?.map(file => {
          return renderFile(file, false, indent + 1)
        })}
      </Fragment>
    )
  }

  return (
    <div className="d-grid gap-2">
      {favorites.length > 0 && (
        <>
          <h6>Favorites</h6>
          <div className="list-group mb-3">
            {favorites.map(favorite => {
              return renderFile(favorite.file, favorite.isBrokenFile || favorite.isBrokenView)
            })}
          </div>
        </>
      )}
      <h6>Directory</h6>
      <div className="list-group mb-2">
        {recFiles.map(file => renderFile(file))}
      </div>
      <button
        className="btn btn-outline-secondary btn-sm"
        type="button"
        onClick={onSetDirectory}
      >
        Set directory
      </button>
    </div>
  )
}
