import { ViewConfig } from '../types/view-config';
import { chunkArray } from '../utils/chunk-array';

export type RenderRule =
  | { type: 'money' }
  | { type: 'percent' }
export type RenderRuleMap = Record<string, RenderRule | undefined>

export const getRenderRules = (view: ViewConfig): RenderRuleMap => {
  if (!view.Render) {
    return {}
  }

  return Object.fromEntries(
    chunkArray(view.Render.replace(/;/g, '').split(' '), 2).map(([fieldName, rule]) => {
      if (rule === 'money' || rule === 'percent') {
        return [fieldName, { type: rule }]
      }
      return [fieldName, undefined]
    })
  )
}
