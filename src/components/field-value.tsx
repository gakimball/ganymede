import { FunctionComponent } from 'preact';
import { DatabaseField, RecordFieldType } from '../types/database';
import { parseFieldValue } from '../utils/parse-field-value';

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

  if (field.type === RecordFieldType.BOOL) {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={parseFieldValue(value, field) === true}
          disabled
        />
      </div>
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
