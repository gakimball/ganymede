import { RenderRule } from './view-config'

export const applyRenderRule = (value: number, rule: RenderRule) => {
  switch (rule.type) {
    case 'money':
      return `$${value.toLocaleString('en-US')}`
    case 'percent':
      return `${(value * 100).toPrecision(2)}%`
  }
}
