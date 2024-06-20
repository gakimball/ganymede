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
  return groupRecordsBy({
    records: sortRecordsBy({
      records: filterRecordsBy(database, config.Filter),
      fields: database.fields,
    }, config.Sort),
    fields: database.fields,
  }, config.Group)
}
