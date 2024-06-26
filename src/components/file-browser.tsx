import { Fragment, FunctionComponent } from 'preact';
import { ViewConfig } from '../types/view-config';
import type { FileEntry } from '@tauri-apps/api/fs';
import { FavoritesEntry } from '../types/favorites-entry';

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

  const renderFile = (file: FileEntry, disabled = false) => {
    const active = file === selectedFile

    return (
      <button
        className={`list-group-item list-group-item-action ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        type="button"
        disabled={disabled}
        onClick={() => onSelectFile(file)}
      >
        {disabled ? '[Broken] ' : ''}
        {file.name}
      </button>
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
