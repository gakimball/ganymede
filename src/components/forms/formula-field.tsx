import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { DatabaseField } from '../../types/database';
import { Button } from '../common/button';
import { TextInput } from './text-input';

interface FormulaFieldProps {
  value?: string;
  field: DatabaseField;
}

export const FormulaField: FunctionComponent<FormulaFieldProps> = ({
  value,
  field,
}) => {
  const [showFormula, setShowFormula] = useState(false)

  return (
    <div className="flex items-stretch">
      <span className="flex flex-col justify-center px-2 border-1 border-border">=</span>
      <div className="font-mono opacity-50">
        <TextInput
          type="text"
          readOnly
          defaultValue={(
            showFormula
              ? (field.formula?.formulaStr ?? '(unknown formula)')
              : value
          )}
        />
      </div>
      <Button type="button" theme="secondary" onClick={() => setShowFormula(v => !v)}>
        {showFormula ? 'Hide' : 'Show'} formula
      </Button>
    </div>
  )
}
