import { FilterTest } from './test-filter';

const FILTER_REGEX = /(?<field>[a-zA-Z][a-zA-Z0-9_]*)( (?<not>not))? (?<cond>set|eq|gte|lte|gt|lt)( (?<value>\S*))?( (?<bool>(and|or)))?/g

export const parseFilterRules = (input: string): FilterTest[] => {
  const re = new RegExp(FILTER_REGEX, 'g')
  const tests: FilterTest[] = []
  let match

  while ((match = re.exec(input)) !== null) {
    const { groups } = match

    if (!groups) {
      continue
    }

    tests.push({
      field: groups.field,
      not: groups.not === 'not',
      condition: groups.cond as FilterTest['condition'],
      value: groups.value ?? '',
      boolean: (groups.bool || 'and') as FilterTest['boolean'],
    })
  }

  return tests
}
