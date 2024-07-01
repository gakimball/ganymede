import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { DatabaseField } from '../types/database';
import { Button } from './button';
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
      <span className="input-group-text">=</span>
      <div className="font-mono">
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
      <Button theme="secondary" onClick={() => setShowFormula(v => !v)}>
        {showFormula ? 'Hide' : 'Show'} formula
      </Button>
    </div>
  )
}
