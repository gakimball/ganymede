import { FunctionComponent } from 'preact';
import { ViewConfig } from '../types/view-config';
import { FileEntry } from '@tauri-apps/api/fs';

interface ViewSelectProps {
  file: FileEntry;
  current: ViewConfig | null;
  onChange: (value: ViewConfig) => void;
  views: ViewConfig[];
}

export const ViewSelect: FunctionComponent<ViewSelectProps> = ({
  file,
  current,
  onChange,
  views,
}) => {
  const textView: ViewConfig = {
    File: file.name ?? '',
    Layout: 'Text',
    Name: 'Text',
  }

  return (
    <ul className="nav nav-tabs">
      {[...views, textView].map(view => (
        <li key={view} className="nav-item">
          <a
            className={`nav-link ${view.Name === current?.Name ? 'active' : ''}`}
            onClick={() => onChange(view)}
            href="#"
          >
            {view.Name}
          </a>
        </li>
      ))}
    </ul>
  )
}
