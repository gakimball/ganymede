import { FunctionComponent } from 'preact';
import { ViewConfig } from '../../types/view-config';
import { FileEntry } from '@tauri-apps/api/fs';
import { Button } from './button';
import classNames from 'classnames';
import queryString from 'query-string';

interface ViewSelectProps {
  file: FileEntry;
  current: ViewConfig | undefined;
  onChange: (value: ViewConfig) => void;
  views: ViewConfig[];
  onCreateNew: () => void;
  onEditView: () => void;
}

export const ViewSelect: FunctionComponent<ViewSelectProps> = ({
  file,
  current,
  views,
  onCreateNew,
  onEditView,
}) => {
  const textView: ViewConfig = {
    File: file.name ?? '',
    Layout: 'Text',
    Name: 'Text',
  }

  return (
    <ul className="flex items-center mb-3 pe-3">
      {[...views, textView].map(view => {
        const isActive = view.Name === current?.Name
        const cls = classNames([
          'pb-1 me-4',
          'font-bold',
          'border-b-2',
          'hover:text-content',
          isActive && 'text-content border-content',
          !isActive && 'text-content-secondary border-transparent',
        ])

        return (
          <a
            key={view.Name}
            href={queryString.stringifyUrl({
              url: '/file',
              query: {
                path: file.path,
                view: view.Name,
              }
            })}
            className={cls}
          >
            {view.Name}
          </a>
        )
      })}
      <div className="flex gap-2 ms-auto">
        <Button theme="primary" onClick={onCreateNew} size="small">
          New record
        </Button>
        {current?.Layout !== 'Text' && (
          <Button theme="secondary" onClick={onEditView} size="small">
            Edit view
          </Button>
        )}
      </div>
    </ul>
  )
}
