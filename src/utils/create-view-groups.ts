import { Database } from '../types/database'
import { ViewConfig } from '../types/view-config'
import { filterRecordsBy } from './filter-records-by'
import { groupRecordsBy } from './group-records-by'
import { sortRecordsBy } from './sort-records-by'

/**
 * Apply filter, sort, and grouping rules to a database based on a view configuration.
 */
export const createViewGroups = (
  database: Database,
  config: ViewConfig,
) => {
  const { fields } = database
  let records = filterRecordsBy(database, config)
  records = sortRecordsBy({ records, fields }, config)

  return groupRecordsBy({ records, fields },  config)
}
