import classNames from 'classnames';
import { FunctionComponent } from 'preact';
import { ReactNode, useState } from 'preact/compat';

interface DropdownProps {
  dropdown: ReactNode;
  placement: 'left' | 'right';
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  children,
  dropdown,
  placement,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(v => !v)}>
        {children}
      </div>
      {isOpen && (
        <div
          className={classNames('absolute z-10', {
            'left-0': placement === 'left',
            'right-0': placement === 'right',
          })}
        >
          {dropdown}
        </div>
      )}
    </div>
  )
}
