import { Fragment, FunctionComponent } from 'preact';
import { ViewConfig } from '../types/view-config';
import type { FileEntry } from '@tauri-apps/api/fs';

interface FileBrowserProps {
  files: FileEntry[];
  views: ViewConfig[];
  onSetDirectory: () => void,
  onSelectFile: (file: FileEntry) => void;
}

export const FileBrowser: FunctionComponent<FileBrowserProps> = ({
  files,
  views,
  onSetDirectory,
  onSelectFile,
}) => {
  const recFiles = files
    .filter(file => file.name?.endsWith('.rec'))
    .sort((a, b) => a.name!.localeCompare(b.name!))

  return (
    <div className="d-grid gap-2">
      <button
        className="btn btn-outline-secondary btn-sm"
        type="button"
        onClick={onSetDirectory}
      >
        Set directory
      </button>
      <div className="list-group">
        {recFiles.map(file => (
          <button
            className="list-group-item list-group-item-action"
            type="button"
            onClick={() => onSelectFile(file)}
          >
            {file.name}
          </button>
        ))}
      </div>
    </div>
  )
}
