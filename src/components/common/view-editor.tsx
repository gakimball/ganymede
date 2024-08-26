import { FunctionComponent } from 'preact';
import { ViewConfig } from '../../utils/view-config';
import { Dropdown } from './dropdown';
import { Button } from './button';
import { Pane } from './pane';
import { SelectField } from '../forms/select-field';
import { Modal } from './modal';
import { FormLabel } from '../forms/form-label';
import { useEventHandler } from '../../hooks/use-event-handler';
import { TextInput } from '../forms/text-input';
import { DatabaseFieldMap, DatabaseRecord } from '../../types/database';
import { parseFormData } from '../../utils/parse-form-data';
import { FileEntry } from '@tauri-apps/api/fs';

interface ViewEditorProps {
  file: FileEntry;
  view?: ViewConfig;
  viewFields: DatabaseFieldMap;
  recordFields: DatabaseFieldMap;
  onChange: (view: DatabaseRecord) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export const ViewEditor: FunctionComponent<ViewEditorProps> = ({
  file,
  view,
  viewFields,
  recordFields,
  onChange,
  onClose,
  onDelete,
}) => {
  const handleSubmit = useEventHandler((event: SubmitEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const config = parseFormData(formData, viewFields)
    config.File = [file.name!]
    onChange(config)
  })

  return (
    <Modal width="500px">
      <form onSubmit={handleSubmit}>
        <FormLabel>Name</FormLabel>
        <TextInput
          name="Name"
          defaultValue={view?.name}
        />
        <br />
        <FormLabel>Record Type</FormLabel>
        <TextInput
          name="Type"
          defaultValue={view?.type ?? ''}
        />
        <br />
        <FormLabel>Layout</FormLabel>
        <SelectField
          name="Layout"
          defaultValue={view?.layout}
          options={[
            { label: 'List', value: 'List' },
            { label: 'Table', value: 'Table' },
            { label: 'Board', value: 'Board' },
            { label: 'Aggregate', value: 'Aggregate' },
          ]}
        />
        <br />
        <FormLabel>Filter</FormLabel>
        <TextInput
          name="Filter"
          defaultValue={view?.filter ?? ''}
        />
        <br />
        <FormLabel>Sort</FormLabel>
        <TextInput
          name="Sort"
          defaultValue={view?.sort?.fields.join(' ') ?? ''}
        />
        <br />
        <FormLabel>Group</FormLabel>
        <SelectField
          name="Group"
          defaultValue={view?.group ?? ''}
          options={[
            {
              value: '',
              label: '(none)'
            },
            ...[...recordFields].map(([, field]) => ({
              value: field.name,
              label: field.name.replace(/_/g, ' '),
            }))
          ]}
        />
        <br />
        <FormLabel>Fields</FormLabel>
        <TextInput
          name="Fields"
          defaultValue={view?.fields?.join(' ') ?? ''}
        />
        <br />
        <FormLabel>Render</FormLabel>
        {view?.render.map((value, index) => (
          <TextInput
            key={value}
            name={`Render.${index}`}
            defaultValue={value.field + ' ' + value.rule.type}
          />
        ))}
        {view?.render.length === 0 && (
          <TextInput
            name="Render.0"
          />
        )}
        <br />
        <FormLabel>Sum</FormLabel>
        <TextInput
          name="Sum"
          defaultValue={view?.sum.join(' ')}
        />
        <br />
        <FormLabel>Full Page</FormLabel>
        <TextInput
          name="Full_Page"
          type="checkbox"
          defaultChecked={view?.fullPage === true}
        />
        <div className="sticky bottom-0 z-10 bg-background flex gap-2 mt-7">
          {onDelete && (
            <Button theme="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" theme="primary" isExpanded>
            {view ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
