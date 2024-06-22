import { RecordFieldType } from '../types/database'

/**
 * Parse a `%type` type from a recfile. Some related types (e.g. `int` and `real`) are currently
 * consolidated into one type.
 */
export const parseTypeDef = (value: string) => {
  const [field, type, ...params] = value.split(' ')

  switch (type) {
    case 'int':
    case 'range':
    case 'real':
      return {
        field,
        type: RecordFieldType.INT,
      }
    case 'enum':
      return {
        field,
        type: RecordFieldType.ENUM,
        params,
      }
    case 'bool':
      return {
        field,
        type: RecordFieldType.BOOL,
      }
    case 'Formula':
      return {
        field,
        type: RecordFieldType.FORMULA,
      }
    case 'line':
    case 'size':
    case 'regexp':
    case 'date':
    case 'email':
    case 'uuid':
    default:
      return {
        field,
        type: RecordFieldType.STRING
      }
  }
}
