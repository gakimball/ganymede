import { DatabaseField, RecordFieldType } from '../types/database';

export const getEnumColor = (value: string, field: DatabaseField) => {
  if (field.type !== RecordFieldType.ENUM || !field.params?.length) {
    return '#444'
  }

  const increment = 300 / (field.params.length - 1)
  const valueIndex = field.params.indexOf(value)

  if (valueIndex === -1) {
    return '#444'
  }

  return `hsl(${valueIndex * increment}, 30%, 50%)`
}
