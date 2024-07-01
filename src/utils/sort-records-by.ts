import { Database, DatabaseRecord } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { chunkArray } from './chunk-array';
import { getSortComparator } from './get-sort-comparator';

/**
 * Apply a view `Sort` rule to a database.
 */
export const sortRecordsBy = (
  database: Database,
  view: ViewConfig,
): DatabaseRecord[] => {
  const sort = view.Sort

  if (!sort) {
    return database.records
  }

  const sorts = chunkArray(sort.split(' '), 2).map(criteria => {
    const [fieldName, direction] = criteria
    const field = database.fields.get(fieldName)

    if (!field) {
      return () => 0
    }

    return getSortComparator(field, direction === 'desc')
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
