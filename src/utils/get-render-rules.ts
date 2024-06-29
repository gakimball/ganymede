import { DatabaseField, RecordFieldType } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { chunkArray } from '../utils/chunk-array';

export type RenderRule =
  | { type: 'money' }
  | { type: 'percent' }
  | { type: 'date'; format: string }
export type RenderRuleMap = Record<string, RenderRule | undefined>

export const getRenderRules = (
  view: ViewConfig,
  fields: Map<string, DatabaseField>,
): RenderRuleMap => {
  if (!view.Render) {
    return {}
  }

  return Object.fromEntries(
    chunkArray(view.Render.replace(/;/g, '').split(' '), 2).map(([fieldName, rule]) => {
      if (rule === 'money' || rule === 'percent') {
        return [fieldName, { type: rule }]
      }
      if (fields.get(fieldName)?.type === RecordFieldType.DATE) {
        return [fieldName, { type: 'date', format: rule.replace(/_/g, ' ') }]
      }
      return [fieldName, undefined]
    })
  )
}
