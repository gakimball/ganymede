import { FunctionComponent } from 'preact';
import { RenderRule, ViewConfig } from '../../utils/view-config';
import { TextInput } from './text-input';
import { SelectField } from './select-field';

type RenderRuleEditorValue = ViewConfig['render'][number]

interface RenderRuleEditorProps {
  value: RenderRuleEditorValue;
  onChange: (value: RenderRuleEditorValue) => void;
}

export const RenderRuleEditor: FunctionComponent<RenderRuleEditorProps> = ({
  value,
  onChange,
}) => {
  const changeType = (type: RenderRule['type']) => {
    switch (type) {
      case 'unknown':
        onChange({
          ...value,
          rule: {
            type,
            text: '',
          },
        })
        break
      case 'date':
        onChange({
          ...value,
          rule: {
            type,
            format: '',
          }
        })
        break
      default:
        onChange({
          ...value,
          rule: { type },
        })
    }
  }

  return (
    <>
      <div>
        <TextInput
          placeholder="Field"
          value={value.field}
          onChange={e => onChange({
            ...value,
            field: e.currentTarget.value,
          })}
        />
      </div>
      <SelectField
        value={value.rule.type}
        onChange={e => changeType(e.currentTarget.value as RenderRule['type'])}
        options={[
          { value: 'percent', label: 'Percent' },
          { value: 'money', label: 'Money' },
          { value: 'date', label: 'Date' },
          { value: 'unknown', label: '(none)' },
        ]}
      />
      {value.rule.type === 'date' && (
        <div>
          <TextInput
            placeholder="Format"
            value={value.rule.format}
            onChange={e => onChange({
              ...value,
              rule: {
                type: 'date',
                format: e.currentTarget.value,
              }
            })}
          />
        </div>
      )}
    </>
  )
}
