import { DatabaseField, DatabaseFieldMap, DatabaseFieldType } from '../types/database';
import { ViewConfig } from '../utils/view-config';
import { chunkArray } from '../utils/chunk-array';

export type RenderRule =
  | { type: 'money' }
  | { type: 'percent' }
  | { type: 'date'; format: string }
export type RenderRuleMap = Record<string, RenderRule | undefined>

export const getRenderRules = (
  view: ViewConfig,
  fields: DatabaseFieldMap,
): RenderRuleMap => {
  if (!view.Render) {
    return {}
  }

  return Object.fromEntries(
    view.Render.map((value) => {
      const [fieldName, rule] = value.split(' ')

      if (rule === 'money' || rule === 'percent') {
        return [fieldName, { type: rule }]
      }

      if (fields.get(fieldName)?.type === DatabaseFieldType.DATE) {
        return [fieldName, { type: 'date', format: rule.replace(/_/g, ' ') }]
      }

      return [fieldName, undefined]
    })
  )
}
