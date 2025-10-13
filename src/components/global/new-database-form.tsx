import { join } from '@tauri-apps/api/path'
import { useStore } from '../../state/use-store'
import { useMemoAsync } from '../../utils/use-memo-async'
import { Modal } from '../common/modal'
import { FormLabel } from '../forms/form-label'
import { TextInput } from '../forms/text-input'
  import { useState } from 'preact/hooks'
import { useEventHandler } from '../../hooks/use-event-handler'
import { ListEditor } from '../common/list-editor'
import { NewDatabaseFormFieldEditor } from '../forms/new-database-form-field-editor'
import { NewDatabaseFormData } from '../../utils/new-database-form-data'

const defaultFormData: NewDatabaseFormData = {
  fileName: '',
  recordName: '',
  fields: [],
}

export const NewDatabaseForm = () => {
  const { modal } = useStore()
  const currentModal = modal.current.value
  const dbPath = currentModal?.type === 'new-database' ? currentModal.file.path : null

  const [formData, setFormData] = useState(defaultFormData)
  const patchFormData = useEventHandler((patch: Partial<NewDatabaseFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }))
  })

  const basePath = useMemoAsync(async () => {
    if (dbPath === null) {
      return ''
    }

    return join(dbPath, '..')
  }, [dbPath])

  if (currentModal?.type !== 'new-database') {
    return null
  }

  return (
    <Modal width="500px">
      <FormLabel>Location</FormLabel>
      <TextInput
        value={basePath}
        disabled={true}
      />
      <br />
      <FormLabel>Filename</FormLabel>
      <TextInput
        value={formData.fileName}
        onChange={e => patchFormData({ fileName: e.currentTarget.value })}
      />
      <br />
      <FormLabel>Record name</FormLabel>
      <TextInput
        value={formData.recordName}
        onChange={e => patchFormData({ recordName: e.currentTarget.value })}
      />
      <br />
      <FormLabel>Fields</FormLabel>
      <ListEditor
        value={formData.fields}
        onChange={fields => patchFormData({ fields })}
        defaultValue={{
          name: '',
          mandatory: false,
          type: 'string',
        }}
        render={(value, changeValue) => (
          <NewDatabaseFormFieldEditor
            value={value}
            onChange={changeValue}
          />
        )}
      />
    </Modal>
  )
}
