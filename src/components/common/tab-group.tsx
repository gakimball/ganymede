import { FunctionComponent } from 'preact';

export const TabGroup: FunctionComponent = ({
  children,
}) => (
  <ul className="flex items-center mb-3">
    {children}
  </ul>
)
