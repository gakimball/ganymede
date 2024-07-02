import { FunctionComponent } from 'preact';

interface FormLabelProps {
  htmlFor?: string;
}

export const FormLabel: FunctionComponent<FormLabelProps> = ({
  children,
  htmlFor,
}) => {
  return (
    <label className="block text-content-secondary mb-1" htmlFor={htmlFor}>
      {children}
    </label>
  )
}
