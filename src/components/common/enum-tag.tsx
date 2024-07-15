import { FunctionComponent } from 'preact';
import { DatabaseField } from '../../types/database';
import { getEnumColor } from '../../utils/get-enum-color';
import { Tag } from './tag';

interface EnumTagProps {
  value: string;
  field: DatabaseField;
}

export const EnumTag: FunctionComponent<EnumTagProps> = ({
  value,
  field,
}) => (
  <Tag color={getEnumColor(value, field)}>
    {value.replace(/_/g, ' ')}
  </Tag>
)
