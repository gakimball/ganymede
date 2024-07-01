import { FunctionComponent } from 'preact';

interface ButtonProps {
  theme?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  size?: 'default' | 'small';
  onClick?: () => void;
}

export const Button: FunctionComponent<ButtonProps> = ({
  theme = 'secondary',
  size = 'default',
  type,
  onClick,
  children,
}) => {
  const themeClasses = {
    primary: 'text-primary border-primary',
    secondary: 'text-content-secondary border-content-secondary',
    danger: 'text-danger border-content-secondary',
  }
  const sizeClasses = {
    default: 'px-3 py-2',
    small: 'px-2 py-1',
  }

  return (
    <button
      className={`border-1 rounded-md ${themeClasses[theme]} ${sizeClasses[size]}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
