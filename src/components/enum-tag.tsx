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
    className="badge"
    style={{
      color: '#fff',
      backgroundColor: getEnumColor(value, field)
    }}
  >
    {value.replace(/_/g, ' ')}
  </span>
)
