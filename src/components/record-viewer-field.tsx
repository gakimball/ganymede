import { FunctionComponent } from 'preact';
import { DatabaseField, DatabaseRecord, RecordFieldType } from '../types/database'
import { SelectField } from './select-field';
import { FormulaField } from './formula-field';
import { parseFieldValue } from '../utils/parse-field-value';
import { TextInput } from './text-input';

interface RecordViewerFieldProps {
  defaultValue?: string;
  field: DatabaseField;
  fieldName: string;
}

export const RecordViewerField: FunctionComponent<RecordViewerFieldProps> = ({
  defaultValue,
  field,
  fieldName,
}) => {
  let defaultChecked
  let type = 'text'

  switch (field.type) {
    case RecordFieldType.ENUM: {
      const options = field.params?.map(value => ({
        value,
        label: value.replace(/_/g, ' ')
      }))

      if (!field.mandatory) {
        options?.unshift({
          value: '',
          label: '',
        })
      }

      return (
        <SelectField
          name={fieldName}
          defaultValue={defaultValue}
          options={options}
        />
      )
    }
    case RecordFieldType.BODY:
      return (
        <textarea
          name={fieldName}
          className="form-control"
          rows={5}
          defaultValue={defaultValue}
        />
      )
    case RecordFieldType.FORMULA:
      return <FormulaField value={defaultValue} field={field} />
    case RecordFieldType.INT:
    case RecordFieldType.RANGE:
    case RecordFieldType.REAL:
      type = 'number'
      break
    case RecordFieldType.DATE:
      type = 'datetime'
      break
    case RecordFieldType.BOOL:
      type = 'checkbox'
      defaultChecked = parseFieldValue(defaultValue, field) === true
      break
  }

  return (
    <TextInput
      name={fieldName}
      defaultValue={defaultValue}
      defaultChecked={defaultChecked}
    />
  )
}
