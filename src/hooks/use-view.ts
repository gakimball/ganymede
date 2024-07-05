import { Database, DatabaseField } from '../types/database'
import { ViewConfig } from '../types/view-config'
import { RenderRuleMap, getRenderRules } from '../utils/get-render-rules'
import { getShownFields } from '../utils/get-shown-fields'
import { ViewRecordGroup, groupRecordsBy } from '../utils/group-records-by'

interface UseView {
  groups: ViewRecordGroup[];
  shownFields: DatabaseField[];
  renderRules: RenderRuleMap;
}

export const useView = (
  database: Database,
  view: ViewConfig,
): UseView => {
  const { fields } = database
  let records = database.records

  if (view.Sort?.endsWith(' desc')) {
    records = [...records].reverse()
  }

  return {
    groups: groupRecordsBy({
      ...database,
      records,
    }, view),
    shownFields: getShownFields(database.fields, view),
    renderRules: getRenderRules(view, database.fields),
  }
}
