import { FunctionComponent } from 'preact';
import { DatabaseRecord, DatabaseFieldType, DatabaseFieldMap } from '../../types/database';
import { ViewConfig } from '../../utils/view-config';
import { getShownFields } from '../../utils/get-shown-fields';
import { parseFieldValue } from '../../utils/parse-field-value';
import { Button } from './button';
import classNames from 'classnames';
import { RecordViewerField } from './record-viewer-field';
import { FormLabel } from '../forms/form-label';
import { useEventHandler } from '../../hooks/use-event-handler';
import { parseFormData } from '../../utils/parse-form-data';

interface RecordViewerProps {
  record?: DatabaseRecord;
  fields: DatabaseFieldMap;
  viewConfig: ViewConfig | undefined;
  onCreate: (record: DatabaseRecord) => void;
  onUpdate: (original: DatabaseRecord, record: DatabaseRecord) => void;
  onDelete: (record: DatabaseRecord) => void;
  onClose: () => void;
}

export const RecordViewer: FunctionComponent<RecordViewerProps> = ({
  record,
  fields,
  viewConfig,
  onCreate,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const shownFields = getShownFields(fields, viewConfig)
  const restFields = [...fields.values()].filter(field => !shownFields.includes(field))
  const allFields = [
    ...shownFields,
    ...restFields,
  ]
  const isFullPage = parseFieldValue(viewConfig?.Full_Page, {
    name: 'Full_Page',
    type: DatabaseFieldType.BOOL,
  })

  const handleSubmit = useEventHandler((event: SubmitEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const update = parseFormData(formData, fields)

    if (record) {
      onUpdate(record, update)
    } else {
      onCreate(update)
    }
  })

  const inlineClasses = 'pt-6 w-auto'
  const paneClasses = classNames(
    'fixed top-0 right-0 z-10',
    'w-[400px] h-full p-4',
    'overflow-auto',
    'bg-background',
    'border-s-1 border-border'
  )

  return (
    <div
      className={isFullPage ? inlineClasses : paneClasses}
    >
      {isFullPage && (
        <div className="mb-3">
          <Button theme="secondary" size="small" onClick={onClose}>
            &larr; Back
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {allFields.map((field) => {
          const values = record?.[field.name]

          return (
            <div key={field.name} className="mb-3">
              <FormLabel htmlFor={field.name}>
                {field.name}
              </FormLabel>
              {values?.map((value, index) => (
                <RecordViewerField
                  key={index}
                  defaultValue={value}
                  index={index}
                  field={field}
                />
              ))}
              {!values && (
                <RecordViewerField
                  index={0}
                  field={field}
                />
              )}
            </div>
          )
        })}
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
