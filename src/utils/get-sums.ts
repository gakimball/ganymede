import { DatabaseField, DatabaseRecord } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { applyRenderRule } from './apply-render-rule';
import { getRenderRules } from './get-render-rules';
import { parseFieldValue } from './parse-field-value';

export const getSums = (
  records: DatabaseRecord[],
  fields: Map<string, DatabaseField>,
  view: ViewConfig,
) => {
  if (!view.Sum) return {}

  const sumFields = view.Sum.split(' ')
  const renderRules = getRenderRules(view)

  return Object.fromEntries(
    sumFields.map(fieldName => {
      const sum = records.reduce((total, record) => {
        const value = parseFieldValue(record[fieldName], fields.get(fieldName)!)

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
}
