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
import { useCallback, useState } from 'preact/hooks';
import { createPlaceholderViewConfig } from '../../utils/create-placeholder-view-config';
import { ListEditor } from './list-editor';
import { RenderRuleEditor } from '../forms/render-rule-editor';

interface ViewEditorProps {
  file: FileEntry;
  view?: ViewConfig;
  viewFields: DatabaseFieldMap;
  recordFields: DatabaseFieldMap;
  onChange: (view: ViewConfig) => void;
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
  const [value, setValue] = useState<ViewConfig>(view ?? {
    ...createPlaceholderViewConfig(),
    file: file.name!,
  })
  const patchValue = useCallback((patch: Partial<ViewConfig>) => {
    setValue(prev => ({
      ...prev,
      ...patch,
    }))
  }, [])

  return (
    <Modal width="500px">
      <FormLabel>Name</FormLabel>
      <TextInput
        value={value.name}
        onChange={e => patchValue({ name: e.currentTarget.value })}
      />
      <br />
      <FormLabel>Record Type</FormLabel>
      <TextInput
        value={value.type ?? ''}
        onChange={e => patchValue({ type: e.currentTarget.value || null })}
      />
      <br />
      <FormLabel>Layout</FormLabel>
      <SelectField
        value={value.layout}
        onChange={e => patchValue({ layout: e.currentTarget.value as ViewConfig['layout'] })}
        options={[
          { label: 'List', value: 'List' },
          { label: 'Table', value: 'Table' },
          { label: 'Record', value: 'Record' },
          { label: 'Board', value: 'Board' },
        ]}
      />
      <br />
      <FormLabel>Filter</FormLabel>
      <TextInput
        value={value.filter ?? ''}
        onChange={e => patchValue({ filter: e.currentTarget.value || null })}
      />
      <br />
      <FormLabel>Sort</FormLabel>
      <TextInput
        value={value.sort?.fields.join(' ') ?? ''}
        onChange={e => {
          const fields = e.currentTarget.value.split(/\s+/)
          patchValue({
            sort: fields.length ? {
              fields,
              descending: value.sort?.descending ?? false,
            } : null,
          })
        }}
      />
      <br />
      <FormLabel>Group</FormLabel>
      <SelectField
        value={value.group ?? ''}
        onChange={e => patchValue({ group: e.currentTarget.value || null })}
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
      <FormLabel>Aggregate</FormLabel>
      <TextInput
        value={value.aggregate ?? ''}
        onChange={e => {
          patchValue({ aggregate: e.currentTarget.value || null })
        }}
      />
      <br />
      <FormLabel>Fields</FormLabel>
      <TextInput
        value={value.fields?.join(' ') ?? ''}
        onChange={e => {
          const fields = e.currentTarget.value.split(/\s+/)
          patchValue({ fields: fields.length ? fields : null })
        }}
      />
      <br />
      <FormLabel>Render</FormLabel>
      <ListEditor
        value={value.render ?? []}
        onChange={render => patchValue({ render })}
        defaultValue={{
          field: '',
          rule: {
            type: 'unknown',
            text: '',
          },
        }}
        render={(value, changeValue) => (
          <RenderRuleEditor
            value={value}
            onChange={changeValue}
          />
        )}
      />
      <br />
      <FormLabel>Sum</FormLabel>
      <TextInput
        value={value.sum.join(' ')}
      />
      <br />
      <FormLabel>Full Page</FormLabel>
      <TextInput
        type="checkbox"
        checked={value.fullPage === true}
        onChange={e => patchValue({ fullPage: e.currentTarget.checked })}
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
        <Button onClick={() => onChange(value)} theme="primary" isExpanded>
          {view ? 'Save' : 'Create'}
        </Button>
      </div>
    </Modal>
  )
}
