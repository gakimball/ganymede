import { FunctionComponent } from 'preact';
import { DatabaseField, DatabaseFieldType } from '../../types/database';
import { parseFieldValue } from '../../utils/parse-field-value';
import { applyRenderRule } from '../../utils/apply-render-rule';
import { formatDate } from '../../utils/format-date';
import { EnumTag } from './enum-tag';
import { logger } from '../../utils/logger';
import { RenderRule } from '../../utils/view-config';

interface FieldValueProps {
  value: string | undefined;
  field: DatabaseField;
  render?: RenderRule;
}

export const FieldValue: FunctionComponent<FieldValueProps> = ({
  value,
  field,
  render,
}) => {
  if (value === undefined || field.type === DatabaseFieldType.BODY) {
    return null
  }

  const parsedValue = parseFieldValue(value, field)

  if (field.type === DatabaseFieldType.ENUM) {
    return (
      <EnumTag value={value} field={field} />
    )
  }

  if (field.type === DatabaseFieldType.ENUM_MULTI) {
    return (
      <div className="inline-flex gap-2">
        {value.split(',').map(item => (
          <EnumTag value={item} field={field} />
        ))}
      </div>
    )
  }

  if (field.type === DatabaseFieldType.BOOL) {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={parsedValue === true}
          disabled
        />
      </div>
    )
  }

  if (field.type === DatabaseFieldType.STRING && value.match(/^https?:\/\//)) {
    return (
      <span>
        <a href={value} className="link">
          {(new URL(value)).hostname}
        </a>
      </span>
    )
  }

  if (value && parsedValue instanceof Date) {
    try {
      return <span>{formatDate(parsedValue, value, render)}</span>
    } catch (err) {
      logger.warn('Could not format date', {
        date: parsedValue,
        string: value,
        format: render,
      })
      return null
    }
  }

  if (render && typeof parsedValue === 'number') {
    return <span>{applyRenderRule(parsedValue, render)}</span>
  }

  return <span>{value}</span>
}
