import { Database, DatabaseField } from '../types/database'
import { RenderRule, ViewConfig } from '../utils/view-config'
import { getShownFields } from '../utils/get-shown-fields'
import { ViewRecordGroup, groupRecordsBy } from '../utils/group-records-by'

export type RenderRuleMap = Record<string, RenderRule | undefined>

interface UseView {
  groups: ViewRecordGroup[];
  shownFields: DatabaseField[];
  renderRules: RenderRuleMap;
}

export const useView = (
  database: Database,
  view: ViewConfig,
): UseView => {
  let records = database.records

  if (view.sort?.descending) {
    records = [...records].reverse()
  }

  return {
    groups: groupRecordsBy({
      ...database,
      records,
    }, view),
    shownFields: getShownFields(database.fields, view),
    renderRules: Object.fromEntries(view.render.map(rule => [rule.field, rule.rule])),
  }
}
