import { DatabaseFieldMap, DatabaseFieldType, DatabaseRecord } from '../types/database';

export const parseFormData = (formData: FormData, fields: DatabaseFieldMap): DatabaseRecord => {
  const record: DatabaseRecord = {}

  for (const key of formData.keys()) {
    let value = formData.get(key)
    const [fieldName, idx = '0'] = key.split('.')
    const field = fields.get(fieldName)

    if (typeof value !== 'string' || !value || !field) {
      continue
    }

    if (field.type === DatabaseFieldType.BOOL) {
      value = String(value === 'on')
    }

    const index = Number.parseInt(idx, 10)

    if (!record[field.name]) {
      record[field.name] = []
    }

    record[field.name]![index] = value
  }

  return record
}
