import { RenderRule } from './get-render-rules';

export const applyRenderRule = (value: number, rule: RenderRule) => {
  switch (rule.type) {
    case 'money':
      return `$${value.toLocaleString('en-US', { maximumSignificantDigits: 2 })}`
    case 'percent':
      return `${(value * 100).toPrecision(2)}%`
  }
}