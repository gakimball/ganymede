import { Database } from '../types/database';
import { ViewConfig } from '../utils/view-config';
import { applyRenderRule } from './apply-render-rule';
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
  const sums = Object.fromEntries(
    view.sum.map(fieldName => {
      const sum = database.records.reduce((total, record) => {
        record[fieldName]?.forEach(value => {
          const parsedValue = parseFieldValue(value, database.fields.get(fieldName)!)

          if (typeof parsedValue === 'number' && !Number.isNaN(parsedValue)) {
            total += parsedValue
          }
        })

        return total
      }, 0)

      const renderRule = view.render.find(rule => rule.field === fieldName)?.rule

      if (renderRule) {
        return [fieldName, applyRenderRule(sum, renderRule)]
      }

      return [fieldName, String(sum)]
    })
  )

  return [true, sums]
}
