import { FunctionComponent } from 'preact';
import { ViewConfig } from '../../types/view-config';
import { FileEntry } from '@tauri-apps/api/fs';
import { Button } from './button';
import classNames from 'classnames';

interface ViewSelectProps {
  file: FileEntry;
  current: ViewConfig | null;
  onChange: (value: ViewConfig) => void;
  views: ViewConfig[];
  onCreateNew: () => void;
}

export const ViewSelect: FunctionComponent<ViewSelectProps> = ({
  file,
  current,
  onChange,
  views,
  onCreateNew,
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
          <button
            key={view}
            type="button"
            className={cls}
            onClick={() => onChange(view)}
          >
            {view.Name}
          </button>
        )
      })}
      <div className="flex gap-2 ms-auto">
        <Button theme="primary" onClick={onCreateNew} size="small">
          New
        </Button>
        <Button theme="secondary" onClick={() => {}} size="small">
          Edit view
        </Button>
      </div>
    </ul>
  )
}
