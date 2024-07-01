import { FunctionComponent, HTMLAttributes } from 'preact/compat'

type TextInputProps = HTMLAttributes<HTMLInputElement>

export const TextInput: FunctionComponent<TextInputProps> = (props) => {
  return (
    <input
      {...props}
      className="form-control"
    />
  )
}
