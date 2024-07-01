import { memo, useEffect, useState } from 'preact/compat';
import { useStore } from '../state/use-store';
import { Modal } from './modal';
import { TextInput } from './text-input';
import { FormLabel } from './form-label';
import { Button } from './button';

export const Prompt = memo(() => {
  const store = useStore()
  const prompt = store.currentPrompt.value
  const defaultValue = prompt?.defaultValue
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(defaultValue ?? '')
  }, [defaultValue])

  if (!prompt) {
    return null
  }

  return (
    <Modal width="300px">
      <FormLabel>
        {prompt.text}
      </FormLabel>
      <TextInput
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        placeholder={prompt.placeholder}
        autoFocus
      />
      <div className="flex gap-2 mt-7">
        <Button
          theme="secondary"
          onClick={() => store.resolvePrompt(null)}
        >
          Cancel
        </Button>
        <Button
          theme="primary"
          onClick={() => store.resolvePrompt(value)}
          isExpanded
          isDisabled={value.length === 0}
        >
          {prompt.submitText ?? 'Submit'}
        </Button>
      </div>
    </Modal>
  )
})
