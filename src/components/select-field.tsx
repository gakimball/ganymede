import { FunctionComponent, HTMLAttributes } from 'preact/compat'
import { Icon } from './icon';

interface SelectFieldProps extends HTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
}

export const SelectField: FunctionComponent<SelectFieldProps> = ({
  options = [],
  ...props
}) => (
  <div className="relative">
    <select {...props} className="form-control">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    <div className="absolute right-4 top-1/2 h-4 -mt-2">
      <Icon name="arrow-down" />
    </div>
  </div>
)
