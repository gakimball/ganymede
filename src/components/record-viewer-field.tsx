import { FunctionComponent } from 'preact';
import { DatabaseField, DatabaseRecord, DatabaseFieldType } from '../types/database'
import { SelectField } from './select-field';
import { FormulaField } from './formula-field';
import { parseFieldValue } from '../utils/parse-field-value';
import { TextInput } from './text-input';

interface RecordViewerFieldProps {
  defaultValue?: string;
  field: DatabaseField;
}

export const RecordViewerField: FunctionComponent<RecordViewerFieldProps> = ({
  defaultValue,
  field,
}) => {
  let defaultChecked
  let type = 'text'

  switch (field.type) {
    case DatabaseFieldType.ENUM: {
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
          name={field.name}
          defaultValue={defaultValue}
          options={options}
        />
      )
    }
    case DatabaseFieldType.BODY:
      return (
        <textarea
          name={field.name}
          className="form-control"
          rows={5}
          defaultValue={defaultValue}
        />
      )
    case DatabaseFieldType.FORMULA:
      return <FormulaField value={defaultValue} field={field} />
    case DatabaseFieldType.INT:
    case DatabaseFieldType.RANGE:
    case DatabaseFieldType.REAL:
      type = 'number'
      break
    case DatabaseFieldType.DATE:
      type = 'datetime'
      break
    case DatabaseFieldType.BOOL:
      type = 'checkbox'
      defaultChecked = parseFieldValue(defaultValue, field) === true
      break
  }

  return (
    <TextInput
      name={field.name}
      defaultValue={defaultValue}
      defaultChecked={defaultChecked}
    />
  )
}
