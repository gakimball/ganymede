import { Database, DatabaseRecord, DatabaseFieldType, DatabaseField } from '../types/database';
import { ViewConfig } from '../types/view-config';
import { emplaceMap } from './emplace-map';

export const GROUP_NOT_SET = Symbol('GROUP_NOT_SET')

export interface ViewRecordGroup {
  id: string | typeof GROUP_NOT_SET;
  title: string;
  records: DatabaseRecord[];
  field: DatabaseField | null;
}

/**
 * Convert a flat list of records into a list of groups, based on the `Group` property of a view.
 */
export const groupRecordsBy = (
  database: Database,
  view: ViewConfig,
): ViewRecordGroup[] => {
  const { records, fields } = database
  const groupBy = view.Group
  const groupByField = groupBy ? fields.get(groupBy) : undefined

  if (!groupByField) {
    return [{
      id: GROUP_NOT_SET,
      title: '(not set)',
      records,
      field: null,
    }]
  }

  const recordGroups = new Map<string, ViewRecordGroup>()
  const notSetRecords: DatabaseRecord[] = []

  // Use a pre-defined group order for enums
  if (groupByField.type === DatabaseFieldType.ENUM) {
    groupByField.params?.forEach(enumValue => {
      recordGroups.set(enumValue, {
        id: enumValue,
        title: enumValue,
        records: [],
        field: groupByField,
      })
    })
  }

  records.forEach(record => {
    const value = record[groupByField.name]

    if (value === undefined) {
      notSetRecords.push(record)
    } else {
      emplaceMap(recordGroups, value, {
        insert: () => ({
          id: value,
          title: value,
          records: [record],
          field: groupByField,
        }),
        update: group => {
          group.records.push(record)
          return group
        }
      })
    }
  })

  return [
    ...recordGroups.values(),
    {
      id: GROUP_NOT_SET,
      title: '(not set)',
      records: notSetRecords,
      field: groupByField,
    }
  ]
}
