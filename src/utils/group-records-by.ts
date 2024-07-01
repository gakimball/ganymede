import { Database, DatabaseRecord, DatabaseFieldType } from '../types/database';
import { ViewConfig } from '../types/view-config';

export const GROUP_NOT_SET = Symbol('GROUP_NOT_SET')

/**
 * Convert a flat list of records into a list of groups, based on the `Group` property of a view.
 */
export const groupRecordsBy = (
  database: Database,
  view: ViewConfig,
) => {
  const { records, fields } = database
  const groupBy = view.Group
  const groupByField = groupBy ? fields.get(groupBy) : undefined

  if (!groupBy || groupByField?.type !== DatabaseFieldType.ENUM || !groupByField.params) {
    return [{
      id: GROUP_NOT_SET,
      title: '(not set)',
      records,
      field: null,
    }]
  }

  const recordGroups: {
    [key: string]: DatabaseRecord[];
  } = Object.fromEntries(groupByField.params.map(value => [
    value,
    [],
  ]))
  const notSetRecords: DatabaseRecord[] = []

  records.forEach(record => {
    const value = record[groupBy]

    if (!value || !(value in recordGroups)) {
      notSetRecords.push(record)
    } else {
      recordGroups[value].push(record)
    }
  })

  return [
    ...groupByField.params.map(value => ({
      id: value,
      title: value,
      records: recordGroups[value],
      field: groupByField,
    })),
    {
      id: GROUP_NOT_SET,
      title: '(not set)',
      records: notSetRecords,
      field: groupByField,
    }
  ]
}
