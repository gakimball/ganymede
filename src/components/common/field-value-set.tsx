import { FunctionComponent } from 'preact';
import { DatabaseField } from '../../types/database';
import { FieldValue } from './field-value';
import { RenderRule } from '../../utils/view-config';

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
