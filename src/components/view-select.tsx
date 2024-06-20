import { FunctionComponent } from 'preact';

interface ViewSelectProps {
  current: string | null;
  onChange: (value: string) => void;
  views: string[];
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
            {view}
          </a>
        </li>
      ))}
    </ul>
  )
}
