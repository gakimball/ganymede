import { Database, DatabaseRecord } from '../types/database'
import { ViewConfig } from '../types/view-config';
import { testFilter } from './test-filter';

const FILTER_REGEX = /(?<field>[a-zA-Z][a-zA-Z0-9_]*)( (?<not>not))? (?<cond>set|eq|gt|lt|gte|lte)( (?<value>\S*))?( (?<bool>(and|or)))?/g

interface FilterTest {
  field: string;
  not: boolean;
  condition: 'set' | 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: string;
  boolean: 'and' | 'or';
}

/**
 * Apply a view `Filter` rule to a database's records.
 */
export const filterRecordsBy = (
  database: Database,
  view: ViewConfig,
): DatabaseRecord[] => {
  const filterBy = view.Filter

  if (!filterBy) {
    return database.records
  }

  const re = new RegExp(FILTER_REGEX, 'g')
  let match
  const tests: FilterTest[] = []

  while ((match = re.exec(filterBy)) !== null) {
    const { groups } = match
    if (!groups) continue
    tests.push({
      field: groups.field,
      not: groups.not === 'not',
      condition: groups.cond as FilterTest['condition'],
      value: groups.value,
      boolean: (groups.boolean || 'and') as FilterTest['boolean'],
    })
  }

  return database.records.filter(record => {
    const expr = tests.map(test => {
      let pass = testFilter(record, database.fields, test)
      if (test.not) pass = !pass
      return `${pass} ${test.boolean === 'and' ? '&&' : '||'}`
    }).join(' ').replace(/ (&&|\|\|)$/, '')

    return (0, eval)(expr)
  })
}
