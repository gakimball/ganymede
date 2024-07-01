import { DatabaseField, DatabaseFieldType } from '../types/database';

const TRUE_REGEX = /(true|yes|1)/

/**
 * Parse the raw string value of a record property, based on the property's field.
 */
export const parseFieldValue = (value: string | undefined, field: DatabaseField) => {
  switch (field.type) {
    case DatabaseFieldType.FORMULA:
      return value
    case DatabaseFieldType.INT:
    case DatabaseFieldType.RANGE:
    case DatabaseFieldType.REAL:
      return Number.parseFloat(value?.replace(/,/g, '') ?? '0')
    case DatabaseFieldType.BOOL:
      return TRUE_REGEX.test(value ?? 'false')
    case DatabaseFieldType.DATE:
      return new Date(value ?? '')
    default:
      return value ?? ''
  }
}
