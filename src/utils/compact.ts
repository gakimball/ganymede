export const compact = <T>(array: Array<T | false | null | undefined>): T[] => {
  return array.filter((item): item is T => !!item)
}
