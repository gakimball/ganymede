import { Fragment, FunctionComponent } from 'preact';
import { ViewConfig } from '../types/view-config';
import type { FileEntry } from '@tauri-apps/api/fs';

interface FileBrowserProps {
  files: FileEntry[];
  views: ViewConfig[];
  onSetDirectory: () => void,
  onSelectView: (file: FileEntry, view: ViewConfig) => void;
}

export const FileBrowser: FunctionComponent<FileBrowserProps> = ({
  files,
  views,
  onSetDirectory,
  onSelectView,
}) => {
  const recFiles = files
    .filter(file => file.name?.endsWith('.rec'))
    .sort((a, b) => a.name!.localeCompare(b.name!))

  return (
    <div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={onSetDirectory}
      >
        Set directory
      </button>
      <div className="list-group">
        {recFiles.map(file => {
          const fileViews = views.filter(view => view.File === file.name)

          return (
            <Fragment key={file.name}>
              <button
                className="list-group-item list-group-item-action disabled"
                type="button"
              >
                {file.name}
              </button>
              {fileViews.map(view => (
                <button
                  key={view.Name}
                  type="button"
                  className="list-group-item list-group-item-action ps-4"
                  onClick={() => onSelectView(file, view)}
                >
                  {view.Name}
                </button>
              ))}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
