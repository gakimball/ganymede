import { FunctionComponent } from 'preact';
import { Icon } from './icon';

interface CalloutProps {
  type: 'error';
}

export const Callout: FunctionComponent<CalloutProps> = ({
  children,
}) => {
  return (
    <div
      className={`
        flex items-start gap-2
        px-3 py-2
        rounded-md
        border-border border-1
      `}
    >
      <div className="relative top-1">
        <Icon name="alert-circle" />
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}
