import { useMemo } from 'preact/hooks'
import { Database } from '../types/database'
import { ViewConfig } from '../types/view-config'
import { getRenderRules } from '../utils/get-render-rules'
import { getShownFields } from '../utils/get-shown-fields'
import { filterRecordsBy } from '../utils/filter-records-by'
import { sortRecordsBy } from '../utils/sort-records-by'
import { groupRecordsBy } from '../utils/group-records-by'

export const useView = (
  database: Database,
  view: ViewConfig,
) => {
  const groups = useMemo(() => {
    const { fields } = database
    let records = filterRecordsBy(database, view)
    records = sortRecordsBy({ records, fields }, view)

    return groupRecordsBy({ records, fields }, view)
  }, [database, view])
  const shownFields = getShownFields(database, view)
  const renderRules = getRenderRules(view, database.fields)

  return {
    groups,
    shownFields,
    renderRules,
  }
}
