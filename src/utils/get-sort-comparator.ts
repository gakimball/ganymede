import { compareAsc } from 'date-fns'
import { DatabaseField, DatabaseRecord, DatabaseFieldType } from '../types/database'
import { parseFieldValue } from './parse-field-value'

const sortFunctions = {
  string: (a: string, b: string) => a.localeCompare(b),
  number: (a: number, b: number) => (a - b),
  bool: (a: boolean, b: boolean) => {
    if (a === b) return 0
    if (a) return 1
    return -1
  },
  date: compareAsc,
}

/**
 * Get a sorting function that compares a specific record on two fields.
 */
export const getSortComparator = (
  field: DatabaseField,
  descending = false,
) => {
  let sortFunc: (a: any, b: any) => number = sortFunctions.string
  if (field.type === DatabaseFieldType.INT) sortFunc = sortFunctions.number
  if (field.type === DatabaseFieldType.BOOL) sortFunc = sortFunctions.bool
  if (field.type === DatabaseFieldType.DATE) sortFunc = sortFunctions.date

  return (a: DatabaseRecord, b: DatabaseRecord) => {
    const comp = sortFunc(
      parseFieldValue(a[field.name], field),
      parseFieldValue(b[field.name], field),
    )
    return descending ? -comp : comp
  }
}
