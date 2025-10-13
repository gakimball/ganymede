import { memo, useEffect, useState } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { Modal } from '../common/modal';
import { TextInput } from '../forms/text-input';
import { FormLabel } from '../forms/form-label';
import { Button } from '../common/button';
import { NO_AUTOCOMPLETE } from '../../utils/constants';

export const Prompt = memo(() => {
  const { prompt } = useStore()
  const current = prompt.current.value
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(current?.defaultValue ?? '')
  }, [current])

  if (!current) {
    return null
  }

  return (
    <Modal width="300px">
      <FormLabel>
        {current.text}
      </FormLabel>
      <TextInput
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        placeholder={current.placeholder}
        autoFocus
        {...NO_AUTOCOMPLETE}
      />
      <div className="flex gap-2 mt-7">
        <Button
          theme="secondary"
          onClick={() => prompt.resolve(null)}
        >
          Cancel
        </Button>
        <Button
          theme="primary"
          onClick={() => prompt.resolve(value)}
          isExpanded
          isDisabled={value.length === 0}
        >
          {current.submitText ?? 'Submit'}
        </Button>
      </div>
    </Modal>
  )
})
