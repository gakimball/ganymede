import { DatabaseField, DatabaseRecord, RecordFieldType } from '../types/database'
import { parseFieldValue } from './parse-field-value'

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
 * Get a sorting function that compares a specific record on two fields.
 */
export const getSortComparator = (
  fieldName: string,
  field: DatabaseField,
  descending = false,
) => {
  let sortFunc: (a: any, b: any) => number = sortFunctions.string
  if (field.type === RecordFieldType.INT) sortFunc = sortFunctions.number
  if (field.type === RecordFieldType.BOOL) sortFunc = sortFunctions.bool

  return (a: DatabaseRecord, b: DatabaseRecord) => {
    const comp = sortFunc(
      parseFieldValue(a[fieldName], field),
      parseFieldValue(b[fieldName], field),
    )
    return descending ? -comp : comp
  }
}
