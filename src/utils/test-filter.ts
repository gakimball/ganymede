import { Database, DatabaseRecord } from '../types/database';
import { getSortComparator } from './get-sort-comparator';
import { parseFieldValue } from './parse-field-value';

export interface FilterTest {
  field: string;
  not: boolean;
  condition: 'set' | 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: string;
  boolean: 'and' | 'or';
}

/**
 * Test if a record matches a specific filter test.
 */
export const testFilter = (
  record: DatabaseRecord,
  fields: Database['fields'],
  test: FilterTest,
) => {
  const field = fields.get(test.field)

  if (!field) return true

  switch (test.condition) {
    case 'set':
      return record[test.field] !== undefined
    case 'eq':
      return parseFieldValue(record[test.field], field) === parseFieldValue(test.value, field)
    default: {
      const comparison = getSortComparator(field)(record, { [test.field]: test.value })

      switch (test.condition) {
        case 'gt': return comparison > 0
        case 'gte': return comparison >= 0
        case 'lt': return comparison < 0
        case 'lte': return comparison <= 0
      }
    }
  }
}
