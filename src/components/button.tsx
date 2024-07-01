import classNames from 'classnames';
import { FunctionComponent } from 'preact';

interface ButtonProps {
  theme?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  size?: 'default' | 'small';
  isExpanded?: boolean;
  onClick?: () => void;
}

const themeClasses = {
  primary: 'text-primary border-primary',
  secondary: 'text-content-secondary border-content-secondary',
  danger: 'text-danger border-content-secondary',
}
const sizeClasses = {
  default: 'px-3 py-2',
  small: 'px-2 py-1',
}

export const Button: FunctionComponent<ButtonProps> = ({
  theme = 'secondary',
  size = 'default',
  type,
  isExpanded,
  onClick,
  children,
}) => {
  const className = classNames(
    'border-1 rounded-md',
    themeClasses[theme],
    sizeClasses[size],
    {
      'block flex-1': isExpanded,
    },
  )

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
