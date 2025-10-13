import { FunctionComponent } from 'preact';
import { Route } from '../../state/router-state'
import { Link } from './link';
import classNames from 'classnames';

interface TabProps {
  isActive?: boolean;
  onClick?: () => void;
  route?: Route | null;
}

export const Tab: FunctionComponent<TabProps> = ({
  children,
  isActive,
  onClick,
  route = null,
}) => (
  <Link
    route={route}
    onClick={onClick}
    className={
      classNames([
        'pb-1 me-4',
        'font-bold',
        'border-b-2',
        'hover:text-content',
        isActive && 'text-content border-content',
        !isActive && 'text-content-secondary border-transparent',
      ])
    }
  >
    {children}
  </Link>
)
