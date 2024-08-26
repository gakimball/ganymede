import { lightFormatters } from 'date-fns';
import { RenderRule } from './view-config';

const FORMAT_DATE_REGEX = /(\w)\1*|''|'(''|[^'])+('|$)|./g
type LightFormatters = typeof lightFormatters
type FormatToken = keyof LightFormatters
type LightFormatter = LightFormatters[FormatToken]

export const formatDate = (
  date: Date,
  originalValue: string,
  renderRule?: RenderRule
): string => {
  if (renderRule?.type !== 'date') return originalValue

  const tokens = renderRule.format.match(FORMAT_DATE_REGEX)

  if (!tokens) return ''

  return tokens
    .map(substring => {
      const firstCharacter = substring[0] as FormatToken
      const formatter = lightFormatters[firstCharacter] as LightFormatter | undefined

      return formatter?.(date, substring) ?? substring
    })
    .join('')
}
