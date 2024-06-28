import { Database, DatabaseRecord } from '../types/database'
import { ViewConfig } from '../types/view-config';
import { parseFilterRules } from './parse-filter-rules';
import { testFilter } from './test-filter';

/**
 * Apply a view `Filter` rule to a database's records.
 */
export const filterRecordsBy = (
  database: Database,
  view: ViewConfig,
): DatabaseRecord[] => {
  if (!view.Filter) {
    return database.records
  }

  const tests = parseFilterRules(view.Filter)

  return database.records.filter(record => {
    const expr = tests.map(test => {
      let pass = testFilter(record, database.fields, test)

      if (test.not) {
        pass = !pass
      }

      return `${pass} ${test.boolean === 'and' ? '&&' : '||'}`
    }).join(' ').replace(/ (&&|\|\|)$/, '')

    return (0, eval)(expr)
  })
}
