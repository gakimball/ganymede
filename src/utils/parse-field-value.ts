import { DatabaseField, RecordFieldType } from '../types/database';

const TRUE_REGEX = /(true|yes|1)/

/**
 * Parse the raw string value of a record property, based on the property's field.
 */
export const parseFieldValue = (value: string | undefined, field: DatabaseField) => {
  switch (field.type) {
    case RecordFieldType.INT:
      return Number.parseFloat(value ?? '0')
    case RecordFieldType.BOOL:
      return TRUE_REGEX.test(value ?? 'false')
    default:
      return value ?? ''
  }
}
