import { Fragment, FunctionComponent } from 'preact';
import { ViewConfig } from '../types/view-config';
import type { FileEntry } from '@tauri-apps/api/fs';

interface FileBrowserProps {
  files: FileEntry[];
  views: ViewConfig[];
  selectedFile?: FileEntry;
  onSetDirectory: () => void,
  onSelectFile: (file: FileEntry) => void;
}

export const FileBrowser: FunctionComponent<FileBrowserProps> = ({
  files,
  selectedFile,
  onSetDirectory,
  onSelectFile,
}) => {
  const recFiles = files
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
        {recFiles.map(file => {
          const active = file === selectedFile

          return (
            <button
              className={`list-group-item list-group-item-action ${active ? 'active' : ''}`}
              type="button"
              onClick={() => onSelectFile(file)}
            >
              {file.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
