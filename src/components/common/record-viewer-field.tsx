import { FunctionComponent } from 'preact';
import { DatabaseField, DatabaseRecord, DatabaseFieldType } from '../../types/database'
import { SelectField } from '../forms/select-field';
import { FormulaField } from '../forms/formula-field';
import { parseFieldValue } from '../../utils/parse-field-value';
import { TextInput } from '../forms/text-input';

interface RecordViewerFieldProps {
  defaultValue?: string;
  field: DatabaseField;
  index: number;
}

export const RecordViewerField: FunctionComponent<RecordViewerFieldProps> = ({
  defaultValue,
  field,
  index,
}) => {
  let defaultChecked
  let type = 'text'
  const inputName = `${field.name}.${index}`

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
          name={inputName}
          defaultValue={defaultValue}
          options={options}
        />
      )
    }
    case DatabaseFieldType.BODY:
      return (
        <textarea
          name={inputName}
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
      name={inputName}
      defaultValue={defaultValue}
      defaultChecked={defaultChecked}
    />
  )
}
