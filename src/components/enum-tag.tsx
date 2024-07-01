import { FunctionComponent } from 'preact';
import { DatabaseField } from '../types/database';
import { getEnumColor } from '../utils/get-enum-color';

interface EnumTagProps {
  value: string;
  field: DatabaseField;
}

export const EnumTag: FunctionComponent<EnumTagProps> = ({
  value,
  field,
}) => (
  <span
    className="py-1 px-2 rounded-md text-sm text-content"
    style={{
      backgroundColor: getEnumColor(value, field)
    }}
  >
    {value.replace(/_/g, ' ')}
  </span>
)
