import { DatabaseFieldMap, DatabaseFieldType, DatabaseRecord } from '../types/database';

export const parseFormData = (formData: FormData, fields: DatabaseFieldMap): DatabaseRecord => {
  return Object.fromEntries(
    [...fields.values()]
      .filter(field => field.type !== DatabaseFieldType.FORMULA)
      .map(field => {
        const value = formData.get(field.name)

        if (field.type === DatabaseFieldType.BOOL) {
          return [field.name, value === 'on' ? 'true' : 'false']
        }

        return [field.name, value ? String(value) : undefined]
      })
  )
}
