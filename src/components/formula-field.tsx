import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { DatabaseField } from '../types/database';

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
    <div className="input-group">
      <span className="input-group-text">=</span>
      <input
        type="text"
        className="form-control font-monospace"
        readOnly
        defaultValue={(
          showFormula
            ? (field.formula?.formulaStr ?? '(unknown formula)')
            : value
        )}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setShowFormula(v => !v)}
      >
        {showFormula ? 'Hide' : 'Show'} formula
      </button>
    </div>
  )
}
