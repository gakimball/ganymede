import { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { DatabaseField, DatabaseRecord, RecordFieldType } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { getShownFields } from '../utils/get-shown-fields';
import { parseFieldValue } from '../utils/parse-field-value';
import s from './record-viewer.module.css'
import { FormulaField } from './formula-field';

interface RecordViewerProps {
  record: DatabaseRecord;
  fields: Map<string, DatabaseField>;
  viewConfig: ViewConfig;
  onSave: (original: DatabaseRecord, record: DatabaseRecord) => void;
  onClose: () => void;
}

export const RecordViewer: FunctionComponent<RecordViewerProps> = ({
  record,
  fields,
  viewConfig,
  onSave,
  onClose,
}) => {
  const shownFields = getShownFields({
    records: [],
    fields,
  }, viewConfig)
  const restFields = [...fields.entries()].filter(([fieldName]) => !shownFields.has(fieldName))
  const allFields = [
    ...shownFields.entries(),
    ...restFields,
  ]

  const handleSubmit = useCallback((event: SubmitEvent) => {
    const formData = new FormData(event.submitter as HTMLFormElement)
    const update = Object.fromEntries(
      [...fields.entries()]
        .filter(([, field]) => field.type !== RecordFieldType.FORMULA)
        .map(([fieldName, field]) => {
          const value = formData.get(fieldName)

          if (field.type === RecordFieldType.BOOL) {
            return [fieldName, value === 'on' ? 'true' : 'false']
          }

          return [fieldName, value ? String(value) : undefined]
        })
    )

    onSave(record, update)
  }, [onSave, onClose, record])

  const renderInput = (fieldName: string, field: DatabaseField) => {
    switch (field.type) {
      case RecordFieldType.STRING:
        return <input name={fieldName} className="form-control" type="text" defaultValue={record[fieldName]} />
      case RecordFieldType.INT:
      case RecordFieldType.RANGE:
      case RecordFieldType.REAL:
        return <input name={fieldName} className="form-control" type="number" defaultValue={record[fieldName]} />
      case RecordFieldType.DATE:
        return <input name={fieldName} className="form-control" type="datetime" defaultValue={record[fieldName]} />
      case RecordFieldType.ENUM:
        return (
          <select name={fieldName} className="form-select" defaultValue={record[fieldName]}>
            {field.params?.map(value => (
              <option key={value} value={value}>
                {value.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        )
      case RecordFieldType.BOOL:
        return <input className="form-check-input ms-3" name={fieldName} type="checkbox" defaultChecked={parseFieldValue(record[fieldName], field) === true} />
      case RecordFieldType.FORMULA:
        return <FormulaField value={record[fieldName]} field={field} />
    }
  }

  return (
    <div className={s.container}>
      <form onSubmit={handleSubmit}>
        {allFields.map(([fieldName, field]) => (
          <div key={fieldName} className="mb-3">
            <label htmlFor={fieldName}>
              {fieldName}
            </label>
            {renderInput(fieldName, field)}
          </div>
        ))}
        <div className="btn-group">
          <button className="btn btn-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}