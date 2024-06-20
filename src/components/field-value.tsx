import { FunctionComponent } from 'preact';
import { DatabaseField, RecordFieldType } from '../types/database';

interface FieldValueProps {
  value: string | undefined;
  field: DatabaseField;
}

export const FieldValue: FunctionComponent<FieldValueProps> = ({
  value,
  field,
}) => {
  if (value === undefined) {
    return null
  }

  if (field.type === RecordFieldType.ENUM) {
    return (
      <span className="badge text-bg-primary">
        {value}
      </span>
    )
  }

  if (field.type === RecordFieldType.STRING && value.match(/^https?:\/\//)) {
    return (
      <p>
        <a href={value}>
          {(new URL(value)).hostname}
        </a>
      </p>
    )
  }

  return <p>{value}</p>
}
