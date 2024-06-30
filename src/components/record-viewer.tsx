import { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { DatabaseField, DatabaseRecord, RecordFieldType } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { getShownFields } from '../utils/get-shown-fields';
import { parseFieldValue } from '../utils/parse-field-value';
import s from './record-viewer.module.css'
import { FormulaField } from './formula-field';

interface RecordViewerProps {
  record?: DatabaseRecord;
  fields: Map<string, DatabaseField>;
  viewConfig: ViewConfig;
  onSave: (original: DatabaseRecord | undefined, record: DatabaseRecord) => void;
  onClose: () => void;
  onDelete: (record: DatabaseRecord) => void;
}

export const RecordViewer: FunctionComponent<RecordViewerProps> = ({
  record,
  fields,
  viewConfig,
  onSave,
  onClose,
  onDelete,
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
  const isFullPage = parseFieldValue(viewConfig.Full_Page, { type: RecordFieldType.BOOL })

  const handleSubmit = useCallback((event: SubmitEvent) => {
    const formData = new FormData(event.currentTarget as HTMLFormElement)
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
      case RecordFieldType.ENUM_MULTI:
        return <input name={fieldName} className="form-control" type="text" defaultValue={record?.[fieldName]} />
      case RecordFieldType.INT:
      case RecordFieldType.RANGE:
      case RecordFieldType.REAL:
        return <input name={fieldName} className="form-control" type="number" defaultValue={record?.[fieldName]} />
      case RecordFieldType.DATE:
        return <input name={fieldName} className="form-control" type="datetime" defaultValue={record?.[fieldName]} />
      case RecordFieldType.ENUM:
        return (
          <select name={fieldName} className="form-select" defaultValue={record?.[fieldName]}>
            {field.params?.map(value => (
              <option key={value} value={value}>
                {value.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        )
      case RecordFieldType.BOOL:
        return <input className="form-check-input ms-3" name={fieldName} type="checkbox" defaultChecked={parseFieldValue(record?.[fieldName], field) === true} />
      case RecordFieldType.FORMULA:
        return <FormulaField value={record?.[fieldName]} field={field} />
      case RecordFieldType.BODY:
        return <textarea name={fieldName} className="form-control" rows={5} defaultValue={record?.[fieldName]} />
    }
  }

  return (
    <div className={`${s.container} ${isFullPage ? s.fullPage : s.pane}`}>
      {isFullPage && (
        <button
          className="btn btn-outline-secondary btn-sm mb-3"
          type="button"
          onClick={onClose}
        >
          &larr; Back
        </button>
      )}
      <form onSubmit={handleSubmit}>
        {allFields.map(([fieldName, field]) => (
          <div key={fieldName} className="mb-3">
            <label htmlFor={fieldName}>
              {fieldName}
            </label>
            {renderInput(fieldName, field)}
          </div>
        ))}
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary me-auto"
            type="submit"
          >
            {record ? 'Save' : 'Create'}
          </button>
          {!isFullPage && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          {record && (
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => onDelete(record)}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
