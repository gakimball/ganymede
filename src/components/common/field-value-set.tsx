import { FunctionComponent } from 'preact';
import { DatabaseField } from '../../types/database';
import { RenderRule } from '../../utils/get-render-rules';
import { FieldValue } from './field-value';

interface FieldValueSetProps {
  value: string[] | undefined;
  field: DatabaseField;
  render?: RenderRule;
}

export const FieldValueSet: FunctionComponent<FieldValueSetProps> = ({
  value,
  ...props
}) => {
  return (
    <div className="inline-flex gap-3 items-center">
      {value?.map(v => <FieldValue value={v} {...props} />)}
    </div>
  )
}
