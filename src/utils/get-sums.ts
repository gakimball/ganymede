import { Database } from '../types/database';
import { ViewConfig } from '../utils/view-config';
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
        record[fieldName]?.forEach(value => {
          const parsedValue = parseFieldValue(value, database.fields.get(fieldName)!)

          if (typeof parsedValue === 'number' && !Number.isNaN(parsedValue)) {
            total += parsedValue
          }
        })

        return total
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
