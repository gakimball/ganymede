import { FunctionComponent } from 'preact';
import { ViewConfig } from '../../utils/view-config';
import { FileEntry } from '@tauri-apps/api/fs';
import { Button } from './button';
import classNames from 'classnames';
import { createTextView } from '../../utils/create-text-view';
import { Link } from './link';

interface ViewSelectProps {
  file: FileEntry;
  current: ViewConfig | undefined;
  onChange: (value: ViewConfig) => void;
  views: ViewConfig[];
  onCreateView: () => void;
  onCreateRecord: () => void;
  onEditView: () => void;
}

const tabClasses = (isActive: boolean) => classNames([
  'pb-1 me-4',
  'font-bold',
  'border-b-2',
  'hover:text-content',
  isActive && 'text-content border-content',
  !isActive && 'text-content-secondary border-transparent',
])

export const ViewSelect: FunctionComponent<ViewSelectProps> = ({
  file,
  current,
  views,
  onCreateRecord,
  onCreateView,
  onEditView,
}) => {
  const textView = createTextView(file)

  return (
    <ul className="flex items-center mb-3">
      {[...views, textView].map(view => {
        const isActive = view.name === current?.name

        return (
          <Link
            key={view.name}
            route={{
              name: 'file',
              path: file.path,
              view: view.name,
            }}
            className={tabClasses(isActive)}
          >
            {view.name}
          </Link>
        )
      })}
      <button className={tabClasses(false)} type="button" onClick={onCreateView}>
        + Add
      </button>
      <div className="flex gap-2 ms-auto">
        <Button theme="primary" onClick={onCreateRecord} size="small">
          New record
        </Button>
        {current?.layout !== 'Text' && (
          <Button theme="secondary" onClick={onEditView} size="small">
            Edit view
          </Button>
        )}
      </div>
    </ul>
  )
}
