import { Database } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { applyRenderRule } from './apply-render-rule';
import { getRenderRules } from './get-render-rules';
import { parseFieldValue } from './parse-field-value';

export const getSums = (
  database: Database,
  view: ViewConfig,
): [
  hasSums: boolean,
  sums: {
    [k: string]: string | undefined;
  }
] => {
  if (!view.Sum) return [false, {}]

  const sumFields = view.Sum.split(' ')
  const renderRules = getRenderRules(view, database.fields)

  const sums = Object.fromEntries(
    sumFields.map(fieldName => {
      const sum = database.records.reduce((total, record) => {
        const value = parseFieldValue(record[fieldName], database.fields.get(fieldName)!)

        if (typeof value !== 'number' || Number.isNaN(value)) {
          return total
        }

        return total + value
      }, 0)

      const renderRule = renderRules[fieldName]

      if (renderRule) {
        return [fieldName, applyRenderRule(sum, renderRule)]
      }

      return [fieldName, String(sum)]
    })
  )

  return [true, sums]
}
