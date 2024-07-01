import { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { DatabaseField, DatabaseRecord, RecordFieldType } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { getShownFields } from '../utils/get-shown-fields';
import { parseFieldValue } from '../utils/parse-field-value';
import { Button } from './button';
import classNames from 'classnames';
import { RecordViewerField } from './record-viewer-field';
import { FormLabel } from './form-label';

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

  const inlineClasses = 'pt-6'
  const paneClasses = classNames(
    'fixed top-0 right-0 z-10',
    'h-full p-4',
    'overflow-auto',
    'bg-background',
    'border-s-1 border-border'
  )

  return (
    <div
      className={isFullPage ? inlineClasses : paneClasses}
      style={{
        width: isFullPage ? 'auto' : '400px',
      }}
    >
      {isFullPage && (
        <div className="mb-3">
          <Button theme="secondary" size="small" onClick={onClose}>
            &larr; Back
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {allFields.map(([fieldName, field]) => (
          <div key={fieldName} className="mb-3">
            <FormLabel htmlFor={fieldName}>
              {fieldName}
            </FormLabel>
            <RecordViewerField
              defaultValue={record?.[fieldName]}
              fieldName={fieldName}
              field={field}
            />
          </div>
        ))}
        <div className="flex gap-2 mt-7">
          {record && (
            <Button
              theme="danger"
              onClick={() => onDelete(record)}
            >
              Delete
            </Button>
          )}
          {!isFullPage && (
            <Button
              theme="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
          <Button theme="primary" type="submit" isExpanded>
            {record ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  )
}
