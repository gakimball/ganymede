import { RecutilsSelector } from '../types/recutils'

export const getRecinsArgs = (selector: RecutilsSelector) => {
  const args: string[] = []

  if (selector.type) {
    args.push('-t', selector.type)
  }

  if ('index' in selector && selector.index !== undefined) {
    args.push('-n', String(selector.index))
  }

  if ('selector' in selector && selector.selector !== undefined) {
    args.push('-e', selector.selector)
  }

  return args
}
