import { FunctionComponent } from 'preact';
import { ViewConfig } from '../../utils/view-config';
import { FileEntry } from '@tauri-apps/api/fs';
import { Button } from './button';
import { createTextView } from '../../utils/create-text-view';
import { Tab } from './tab';
import { TabGroup } from './tab-group';

interface ViewSelectProps {
  file: FileEntry;
  current: ViewConfig | undefined;
  onChange: (value: ViewConfig) => void;
  views: ViewConfig[];
  onCreateView: () => void;
  onCreateRecord: () => void;
  onEditView: () => void;
}

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
    <TabGroup>
      {[...views, textView].map(view => (
        <Tab
          key={view.name}
          route={{
            name: 'file',
            path: file.path,
            view: view.name,
          }}
          isActive={view.name === current?.name}
        >
          {view.name}
        </Tab>
      ))}
      <Tab onClick={onCreateView}>
        + Add
      </Tab>
      <div className="flex gap-2 ms-auto">
        <Button theme="primary" onClick={onCreateRecord} size="small">
          New {current?.type?.replace(/_/g, ' ').toLowerCase() ?? 'record'}
        </Button>
        {current?.layout !== 'Text' && (
          <Button theme="secondary" onClick={onEditView} size="small">
            Edit view
          </Button>
        )}
      </div>
    </TabGroup>
  )
}
