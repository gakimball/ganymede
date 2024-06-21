import { Database } from '../types/database';
import { chunkArray } from './chunk-array';
import { getSortComparator } from './get-sort-comparator';

const sortFunctions = {
  string: (a: string, b: string) => a.localeCompare(b),
  number: (a: number, b: number) => (a - b),
  bool: (a: boolean, b: boolean) => {
    if (a === b) return 0
    if (a) return 1
    return -1
  }
}

/**
 * Apply a view `Sort` rule to a database.
 */
export const sortRecordsBy = (
  database: Database,
  sort: string | undefined,
) => {
  if (!sort) {
    return database.records
  }

  const sorts = chunkArray(sort.split(' '), 2).map(criteria => {
    const [fieldName, direction] = criteria
    const field = database.fields.get(fieldName)
    const descending = direction === 'desc'

    if (!field) {
      return () => 0
    }

    return getSortComparator(fieldName, field, direction === 'desc')
  })

  return [...database.records].sort((a, b) => {
    let comp = 0

    for (const sort of sorts) {
      comp = sort(a, b)
      if (comp !== 0) break
    }

    return comp
  })
}
