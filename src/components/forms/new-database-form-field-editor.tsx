import { FunctionComponent } from 'preact';
import { TextInput } from './text-input';
import { useEventHandler } from '../../hooks/use-event-handler';
import { SelectField } from './select-field';

export interface NewDatabaseFormFieldEditorValue {
  name: string;
  mandatory: boolean;
  type: 'string' | 'int' | 'real' | 'enum' | 'bool' | 'body' | 'date';
  enum?: string[];
}

interface NewDatabaseFormFieldEditorProps {
  value: NewDatabaseFormFieldEditorValue;
  onChange: (value: NewDatabaseFormFieldEditorValue) => void;
}

export const NewDatabaseFormFieldEditor: FunctionComponent<NewDatabaseFormFieldEditorProps> = ({
  value,
  onChange,
}) => {
  const patchValue = useEventHandler((patch: Partial<NewDatabaseFormFieldEditorValue>) => {
    onChange({
      ...value,
      ...patch,
    })
  })

  return (
    <>
      <div className="flex-1">
        <TextInput
          value={value.name}
          onChange={e => patchValue({ name: e.currentTarget.value })}
        />
      </div>
      <div className="flex-1">
        <SelectField
          value={value.type}
          onChange={e => patchValue({ type: e.currentTarget.value as NewDatabaseFormFieldEditorValue['type'] })}
          options={[
            { label: 'String', value: 'string' },
            { label: 'Body', value: 'body' },
            { label: 'Number', value: 'int' },
            { label: 'Float', value: 'real' },
            { label: 'Enum', value: 'enum' },
            { label: 'Boolean', value: 'bool' },
            { label: 'Date', value: 'date' },
          ]}
        />
      </div>
      <div className="flex-1">
        <SelectField
          value={String(value.mandatory)}
          onChange={e => patchValue({ mandatory: e.currentTarget.value === 'true' })}
          options={[
            { label: 'Optional', value: 'false' },
            { label: 'Required', value: 'true' },
          ]}
        />
      </div>
    </>
  )
}
