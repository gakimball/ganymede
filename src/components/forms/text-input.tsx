import { FunctionComponent, HTMLAttributes, useEffect, useRef } from 'preact/compat'
import { Button } from '../common/button'
import { open } from '@tauri-apps/api/shell'

type TextInputProps = HTMLAttributes<HTMLInputElement>

export const TextInput: FunctionComponent<TextInputProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null)
  const { autocorrect } = props

  useEffect(() => {
    // macOS flips this from `off` to `on` automatically, presumably based on a user preference
    if (autocorrect === 'off' && ref.current?.getAttribute('autocorrect') === 'on') {
      ref.current.setAttribute('autocorrect', 'off')
    }
  }, [autocorrect])

  return (
    <div className="flex">
      <input
        {...props}
        ref={ref}
        className="form-control"
      />
      {String(props.defaultValue).match(/^https?:\/\//) && (
        <Button
          theme="secondary"
          onClick={() => {
            if (ref.current) {
              open(ref.current.value)
            }
          }}
        >
          Open
        </Button>
      )}
    </div>
  )
}
