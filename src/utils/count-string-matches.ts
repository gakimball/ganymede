export const countStringMatches = (str: string, re: RegExp) => {
  return str.match(re)?.length ?? 0
}
