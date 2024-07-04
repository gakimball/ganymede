import { FunctionComponent } from 'preact';
import { DatabaseRecord, DatabaseFieldType, DatabaseFieldMap } from '../../types/database';
import { ViewConfig } from '../../types/view-config';
import { getShownFields } from '../../utils/get-shown-fields';
import { parseFieldValue } from '../../utils/parse-field-value';
import { Button } from './button';
import classNames from 'classnames';
import { RecordViewerField } from './record-viewer-field';
import { FormLabel } from '../forms/form-label';
import { useEventHandler } from '../../hooks/use-event-handler';

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
  const shownFields = getShownFields({
    records: [],
    fields,
  }, viewConfig)
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
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const update = Object.fromEntries(
      [...fields.values()]
        .filter(field => field.type !== DatabaseFieldType.FORMULA)
        .map(field => {
          const value = formData.get(field.name)

          if (field.type === DatabaseFieldType.BOOL) {
            return [field.name, value === 'on' ? 'true' : 'false']
          }

          return [field.name, value ? String(value) : undefined]
        })
    )

    if (record) {
      onUpdate(record, update)
    } else {
      onCreate(update)
    }
  })

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
        {allFields.map((field) => (
          <div key={field.name} className="mb-3">
            <FormLabel htmlFor={field.name}>
              {field.name}
            </FormLabel>
            <RecordViewerField
              defaultValue={record?.[field.name]}
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
