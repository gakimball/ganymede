import { FunctionComponent } from 'preact';
import { ViewConfig } from '../types/view-config';

interface ViewSelectProps {
  current: ViewConfig | null;
  onChange: (value: ViewConfig) => void;
  views: ViewConfig[];
}

export const ViewSelect: FunctionComponent<ViewSelectProps> = ({
  current,
  onChange,
  views,
}) => {
  return (
    <ul className="nav nav-tabs">
      {views.map(view => (
        <li key={view} className="nav-item">
          <a
            className={`nav-link ${view === current ? 'active' : ''}`}
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
